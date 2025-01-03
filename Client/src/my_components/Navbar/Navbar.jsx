function Navbar() {
  return (
    <nav className="py-2 px-4 md:px-12 lg:px-20 flex text-xl justify-between items-center bg-slate-100">
      <h1 className="font-semibold">Lab Management System</h1>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Food Safety & Standards</span>
          <span className="text-xs text-gray-400">Authority of India</span>
        </div>
        <img src="/pngegg.png" alt="logo" className="h-10 w-16" />
      </div>
    </nav>
  );
}

export default Navbar;
