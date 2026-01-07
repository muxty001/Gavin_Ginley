import React from "react";
import AppLayout from "@/components/AppLayout";
import Sample from "@/components/Sample";
import { AppProvider } from "@/contexts/AppContext";

const Index: React.FC = () => {
  return (
    <AppProvider>
      {/* <Sample /> */}
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
