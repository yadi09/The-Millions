import type { ReactNode } from "react";
import { Header } from "./header";
import { GlobalFooter } from "./GlobalFooter";
import { landingContent } from "../data/landingContent";
import { useGetFooterQuery } from "../features/api/apiSlice";
import { EditModeProvider } from "../features/edit/EditModeContext";
import { EditOverlay } from "../features/edit/EditOverlay";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { data: footerData } = useGetFooterQuery();

  const contact = footerData?.contact || landingContent.contact;
  const footer = footerData?.footer || landingContent.footer;

  return (
    <EditModeProvider>
      <EditOverlay>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <GlobalFooter contact={contact} footer={footer} />
        </div>
      </EditOverlay>
    </EditModeProvider>
  );
};

export default Layout;