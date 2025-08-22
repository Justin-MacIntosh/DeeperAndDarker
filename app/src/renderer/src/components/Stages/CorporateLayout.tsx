import './corporate-style.css';

const CorporateLayout = () => {
  return (
    <main
      id="corporate-main"
      data-theme="corporate"
      className="absolute top-0 w-full mouse-affected-bg bg-gray-200 min-h-screen min-w-[1100px]"
    >
      <div className="absolute z-[2] top-1/2 left-1/2 justify-items-center transform -translate-x-1/2 -translate-y-1/2">
        <div className="corporate-container">Greetings, trusted partner!</div>
      </div>
    </main>
  );
}

export default CorporateLayout;
