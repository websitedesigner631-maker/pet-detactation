export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid place-items-center min-h-screen p-4 bg-gradient-to-b from-blue-100 to-white dark:from-slate-900 dark:to-background">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
