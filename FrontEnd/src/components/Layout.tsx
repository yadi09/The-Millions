import type { ReactNode } from "react";
import { Header } from "./header";
import { GlobalFooter } from "./GlobalFooter";
import { landingContent } from "../data/landingContent";
import { useGetFooterQuery } from "../features/api/apiSlice";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { data: footerData } = useGetFooterQuery();

  const contact = footerData?.contact || landingContent.contact;
  const footer = footerData?.footer || landingContent.footer;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <GlobalFooter contact={contact} footer={footer} />
    </div>
  );
};

export default Layout;