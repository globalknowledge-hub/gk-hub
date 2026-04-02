import Link from 'next/link';

export default function Home() {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'as', name: 'অসমীয়া (Assamese)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Global Education Hub
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your source for the latest education news, scholarships, and career opportunities
          </p>
          <p className="text-gray-500">
            Across India and Beyond
          </p>
        </div>

        {/* Language Selection */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-6">Select your language:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={`/${lang.code}`}
                className="group px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {lang.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl mb-3">📰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Latest News</h3>
            <p className="text-gray-600 text-sm">
              Breaking education news from across the region
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="font-semibold text-gray-900 mb-2">Scholarships</h3>
            <p className="text-gray-600 text-sm">
              Discover educational opportunities and funding
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Multilingual</h3>
            <p className="text-gray-600 text-sm">
              Content in your native language and more
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
