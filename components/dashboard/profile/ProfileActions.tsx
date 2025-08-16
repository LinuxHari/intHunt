"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useTransition } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { deleteUser } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ProfileActions = () => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isDeleting, startDeletion] = useTransition();
  const router = useRouter();

  const handleDeletion = () => {
    startDeletion(async () => {
      const { success } = await deleteUser();
      if (success) {
        toast.success("Account was deleted successfully");
        router.push("/");
      } else toast.error("Failed to delete account");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* <Button variant="outline" className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            Export Data
          </Button> */}
        <Button
          variant="outline"
          className="w-full text-red-600 hover:text-red-700"
          onClick={() => setIsShowDeleteModal(!isShowDeleteModal)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash className="h-4 w-4 mr-1" />
          )}
          Delete Account
        </Button>
      </CardContent>
      <DeleteConfirmModal
        open={isShowDeleteModal}
        onOpenChange={setIsShowDeleteModal}
        handleDeletion={handleDeletion}
      />
    </Card>
  );
};

export default ProfileActions;
