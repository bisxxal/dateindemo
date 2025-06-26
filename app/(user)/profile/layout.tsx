export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      {children}

      <div>
        <p className="logo3 ml-5 text-7xl max-md:text-6xl text-[100px]  flex flex-col font-bold my-10 text-[#8d8d8d82] block mb-10">Made</p>
        <p className=" ml-5 logo3 text-7xl max-md:text-6xl text-[100px]  flex flex-col font-bold my-10 text-[#8d8d8d82]">
          With Love ♡.</p>
      </div>
    </div>
  );
}
