"use client";
import Image from "next/image";
import { signOut } from "@/lib/action/auth-actions";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface IUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
}

export default function UserInfo({ user }: { user?: IUser | null }) {
  const router = useRouter();

  if (!user) return null;

  const onLogout = async () => {
    await signOut({
      router,
      callbackURL: "/",
    });
  };

  return (
    <div className="p-2 border-t border-gray-200">
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3 hover:bg-gray-100 cursor-pointer">
        <Image
          src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?auto=format&fit=crop&w=400&q=80"
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full object-cover shadow-md"
        />
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 truncate text-sm">{user.name}</p>
          <small className="text-gray-500 text-xs">{user.email}</small>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 mb-2  
              text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-xl"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm">Logout</span>
      </button>
    </div>
  );
}
