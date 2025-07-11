const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
      import UrlShortenerForm from '@/components/UrlShortenerForm';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Quick<span className="text-blue-600">Link</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform long URLs into short, manageable links with advanced analytics and custom shortcodes
          </p>
        </div>
        
        <UrlShortenerForm />
      </main>
    </div>
  );
};
export default Index;
