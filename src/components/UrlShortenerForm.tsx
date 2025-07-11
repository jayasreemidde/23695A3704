import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UrlManager } from '@/utils/urlManager';
import { ShortenedUrl } from '@/types';
import { Copy, ExternalLink, Clock } from 'lucide-react';

const UrlShortenerForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [validityMinutes, setValidityMinutes] = useState(30);
  const [customShortcode, setCustomShortcode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = UrlManager.createShortenedUrl(
        originalUrl, 
        validityMinutes, 
        customShortcode || undefined
      );

      if (result) {
        setShortenedUrls(prev => [result, ...prev]);
        setOriginalUrl('');
        setCustomShortcode('');
        
        toast({
          title: "URL Shortened Successfully!",
          description: `Your shortened URL is ready: ${window.location.origin}/${result.shortCode}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create shortened URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    });
  };

  const redirectToUrl = (shortCode: string) => {
    const url = UrlManager.getShortenedUrl(shortCode);
    if (url) {
      UrlManager.recordClick(shortCode, 'direct', 'localhost');
      window.open(url.originalUrl, '_blank');
    } else {
      toast({
        title: "Error",
        description: "URL not found or has expired",
        variant: "destructive",
      });
    }
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Shorten Your URLs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="originalUrl" className="text-sm font-medium text-gray-700">
                Original URL *
              </Label>
              <Input
                id="originalUrl"
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validityMinutes" className="text-sm font-medium text-gray-700">
                  Validity Period (minutes)
                </Label>
                <Input
                  id="validityMinutes"
                  type="number"
                  value={validityMinutes}
                  onChange={(e) => setValidityMinutes(parseInt(e.target.value) || 30)}
                  min="1"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customShortcode" className="text-sm font-medium text-gray-700">
                  Custom Shortcode (optional)
                </Label>
                <Input
                  id="customShortcode"
                  value={customShortcode}
                  onChange={(e) => setCustomShortcode(e.target.value)}
                  placeholder="mycustomcode"
                  pattern="[a-zA-Z0-9]{3,10}"
                  className="h-12"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || !originalUrl.trim()}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              {isLoading ? 'Creating...' : 'Shorten URL'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {shortenedUrls.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Your Shortened URLs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {shortenedUrls.map((url) => (
              <div
                key={url.id}
                className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-mono text-blue-600">
                      {window.location.origin}/{url.shortCode}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${window.location.origin}/${url.shortCode}`)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => redirectToUrl(url.shortCode)}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTimeRemaining(url.expiresAt)} remaining
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  Original: {url.originalUrl}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Clicks: {url.clicks.length} | Created: {url.createdAt.toLocaleString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UrlShortenerForm;
