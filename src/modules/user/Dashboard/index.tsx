"use client";

import {
  CheckCircle,
  TrendingUp,
  Briefcase,
  FileText,
} from "lucide-react";
import { useState } from "react";
import FileStorageList from "../FileStorage/FileList";

interface IUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
}

export default function Dashboard({ user, crsData }: { user: IUser; crsData: any }) {
 
  // if (!user) return null; // Logic handled by parent server component redirects if no session

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#e23a41] to-[#ff6b35] rounded-2xl p-8 text-white shadow-xl">
        {" "}
        <h2 className="text-white mb-2">Welcome back, {user.name}👋</h2>{" "}
        <p className="text-white/90 text-base">
          {" "}
          Here's your immigration report summary{" "}
        </p>{" "}
      </div>

     <FileStorageList userId={user.id} />
      {/* Bottom Grid */}

    </div>
    
  );
}
