export default function MixPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white dark:bg-[#121212] text-[#444444] dark:text-[#f1f1f1] px-8 min-h-screen max-w-3xl flex flex-col space-y-4 mx-auto justify-start  items-center overflow-y-auto">
      {children}
    </main>
  );
}
