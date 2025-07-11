import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UrlManager } from '@/utils/urlManager';
import { ShortenedUrl } from '@/types';
import { BarChart3, Clock, MousePointer, ExternalLink, Calendar } from 'lucide-react';

const Statistics = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);

  useEffect(() => {
    const loadUrls = () => {
      UrlManager.removeExpiredUrls();
      setUrls(UrlManager.getAllUrls());
    };

    loadUrls();
    const interval = setInterval(loadUrls, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (url: ShortenedUrl) => {
    const now = new Date();
    const isExpired = now > url.expiresAt;
    
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    return <Badge variant="default" className="bg-green-500">Active</Badge>;
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const getTotalClicks = () => {
    return urls.reduce((total, url) => total + url.clicks.length, 0);
  };

  const getActiveUrls = () => {
    const now = new Date();
    return urls.filter(url => url.expiresAt > now).length;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Statistics</h1>
        <p className="text-gray-600">Track performance and analytics for your shortened URLs</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{urls.length}</h3>
            <p className="text-gray-600">Total URLs</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <MousePointer className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{getTotalClicks()}</h3>
            <p className="text-gray-600">Total Clicks</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">{getActiveUrls()}</h3>
            <p className="text-gray-600">Active URLs</p>
          </CardContent>
        </Card>
      </div>

      {/* URL List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">All Shortened URLs</CardTitle>
        </CardHeader>
        <CardContent>
          {urls.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No URLs Found</h3>
              <p className="text-gray-400">Create your first shortened URL to see statistics here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {urls.map((url) => (
                <div
                  key={url.id}
                  className="border rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-mono text-blue-600 font-semibold">
                          /{url.shortCode}
                        </span>
                        {getStatusBadge(url)}
                      </div>
                      <p className="text-gray-600 break-all">
                        <ExternalLink className="h-4 w-4 inline mr-2" />
                        {url.originalUrl}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500 ml-4">
                      <div className="flex items-center mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTimeRemaining(url.expiresAt)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {url.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Click Statistics</h4>
                        <p className="text-gray-600">
                          <MousePointer className="h-4 w-4 inline mr-1" />
                          Total Clicks: <span className="font-semibold">{url.clicks.length}</span>
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Validity</h4>
                        <p className="text-gray-600">
                          Period: {url.validityMinutes} minutes
                        </p>
                        <p className="text-gray-600">
                          Expires: {url.expiresAt.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Recent Clicks</h4>
                        {url.clicks.length > 0 ? (
                          <div className="space-y-1">
                            {url.clicks.slice(-3).reverse().map((click, index) => (
                              <div key={index} className="text-xs text-gray-500">
                                {click.timestamp.toLocaleString()} - {click.source}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-xs">No clicks yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
