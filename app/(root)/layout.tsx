import { ReactNode } from "react";
// import { redirect } from "next/navigation";

// import { isAuthenticated } from "@/lib/actions/auth.action";
import Navigation from "@/components/layouts/Navigation";
import Footer from "@/components/layouts/Footer";

const Layout = async ({
  children,
}: {
  children: ReactNode;
  modal: ReactNode;
}) => {
  // const isUserAuthenticated = await isAuthenticated();
  // if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout space-y-14">
      <Navigation />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
