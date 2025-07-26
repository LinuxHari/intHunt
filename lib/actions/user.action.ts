"use server";

import { PasswordFormType, ProfileFormType } from "@/schema";
import { getCurrentUser } from "./auth.action";
import { auth, db } from "@/firebase/admin";

import {
  CatchReturn,
  ReturnAttended,
  ReturnProfile,
  ReturnPublished,
  ReturnUpcoming,
  ReturnUserAnalytics,
  ReturnUserRecents,
} from "./type";

export const updateProfile = async (updatedProfile: ProfileFormType) => {
  try {
    const user = await getCurrentUser();

    if (!user) throw "User not found";

    const userDocRef = db.collection("users").doc(user.id);
    await userDocRef.set(
      {
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role,
        about: updatedProfile.about,
        ...(updatedProfile.avatar && { avatar: updatedProfile.avatar }),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: error,
    };
  }
};

export const updatePassword = async (passwords: PasswordFormType) => {
  const user = await getCurrentUser();

  if (!user) throw "Unauthorized user";
  try {
    await auth.updateUser(user.id, {
      password: passwords.newPassword,
    });
    return {
      success: true,
      message: "Password updated",
    };
  } catch (error: unknown) {
    console.error("Error updating password:", error);
    return {
      success: false,
      message: error,
    };
  }
};

export const getUserAnalytics = async (): Promise<
  ReturnUserAnalytics | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const analyticsSnapshot = await db
      .collection("userstats")
      .where("userId", "==", user.id)
      .select("analytics")
      .get();

    if (analyticsSnapshot.empty) throw "Analytics does not exist";

    const analytics = analyticsSnapshot.docs[0].data().analytics;
    return { success: true, analytics };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const getUserRecents = async (): Promise<
  ReturnUserRecents | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const recentsSnapshot = await db
      .collection("userstats")
      .where("userId", "==", user.id)
      .select("recents")
      .get();

    if (recentsSnapshot.empty) throw "Recents does not exist";

    const recents = recentsSnapshot.docs[0].data().recents;
    return { success: true, recents };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const getUpcomingStats = async (): Promise<
  ReturnUpcoming | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const upcomingSnapshot = await db
      .collection("userstats")
      .where("userId", "==", user.id)
      .select("upcoming")
      .get();

    if (upcomingSnapshot.empty) throw "Upcoming does not exist";

    const upcomingStats = upcomingSnapshot.docs[0].data().upcoming;
    return { success: true, upcomingStats };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const getPublishedStats = async (): Promise<
  ReturnPublished | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const publishedSnapshot = await db
      .collection("userstats")
      .where("userId", "==", user.id)
      .select("published")
      .get();

    if (publishedSnapshot.empty) throw "Published does not exist";

    const publishedStats = publishedSnapshot.docs[0].data().published;
    return { success: true, publishedStats };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const getAttendedStats = async (): Promise<
  ReturnAttended | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const attendedSnapshot = await db
      .collection("userstats")
      .where("userId", "==", user.id)
      .select("attended")
      .get();

    if (attendedSnapshot.empty) throw "Attended does not exist";

    const attendedStats = attendedSnapshot.docs[0].data().attended;
    return { success: true, attendedStats };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};

export const getProfileStats = async (): Promise<
  ReturnProfile | CatchReturn
> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw "Unauthorized user";

    const stats = await db
      .collection("userstats")
      .where("userId", "==", user.id)
      .select("profile", "attended")
      .get();

    if (stats.empty) throw "Attended does not exist";

    const profileStats = {
      ...stats.docs[0].data().profile,
      averageScore: stats.docs[0].data().attended.averageScore,
    };
    return { success: true, profileStats };
  } catch (err: unknown) {
    console.error(err);
    return { success: false, message: err };
  }
};
