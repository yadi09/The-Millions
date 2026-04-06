import type { ReactNode } from "react";
import { Header } from "./header";
import { GlobalFooter } from "./GlobalFooter";
import { landingContent } from "../data/landingContent";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <GlobalFooter contact={landingContent.contact} footer={landingContent.footer} />
    </div>
  );
};

export default Layout;