function Navbar() {
  return (
    <>
    <nav className="py-2 px-4 md:px-12 lg:px-20 flex text-xl justify-between items-center bg-accent">
      <h1 className="font-semibold text-accent-foreground">Lab Management System</h1>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Food Safety & Standards</span>
          <span className="text-xs text-muted-foreground">Authority of India</span>
        </div>
        <img src="/pngegg.png" alt="logo" className="h-10 w-16" />
      </div>
    </nav>
    </>
  );
}

export default Navbar;
