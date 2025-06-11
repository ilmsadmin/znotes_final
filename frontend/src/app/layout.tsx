import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteFlow",
  description: "A versatile note-taking and task management application with smart organization, team collaboration, and offline sync.",
  keywords: ["notes", "tasks", "productivity", "collaboration", "offline sync"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
