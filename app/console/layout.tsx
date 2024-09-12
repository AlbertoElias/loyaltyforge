import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "@/app/(components)/LogoutButton";
import { ApiKeyDisplay } from "../(components)/ApiKeyDisplay";

export default function ConsoleLayout({ children }: { children: ReactNode }) {

	return (
		<div className="flex h-screen bg-gray-100">
			<div className="w-64 bg-white shadow-md flex flex-col">
				<div className="p-6">
					<Link href="/console/collections" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
						Loyalty Forge
					</Link>
				</div>
				<nav className="mt-6 flex-grow">
					<Link href="/console/collections" className="block py-2 px-4 text-gray-600 hover:bg-gray-200 hover:text-gray-800">
						Collections
					</Link>
					<Link href="/console/wallets" className="block py-2 px-4 text-gray-600 hover:bg-gray-200 hover:text-gray-800">
						Wallets
					</Link>
				</nav>
				<div className="p-4">
					<LogoutButton />
				</div>
			</div>

			{/* Main content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<header className="bg-white shadow-md py-4 px-8">
					<div className="flex items-center justify-end">
						<ApiKeyDisplay className="text-sm bg-gray-100 rounded-md px-3 py-2 hover:bg-gray-200 transition-colors duration-200" />
					</div>
				</header>
				<main className="flex-1 overflow-auto p-8">
					{children}
				</main>
			</div>
		</div>
	);
}