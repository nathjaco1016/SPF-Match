import { useEffect, useState } from "react";
import { ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../assets/card";
import { Alert, AlertDescription } from "../assets/alert";
import type { Resource } from "../types/resource";

export function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        // Fetch from static JSON file (synced via GitHub Actions)
        // Add cache-busting query parameter to ensure fresh data
        const response = await fetch(`/data/resources.json?t=${Date.now()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch resources: ${response.statusText}`);
        }

        const data: Resource[] = await response.json();
        setResources(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError(err instanceof Error ? err.message : "Failed to load resources");
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="mb-4">Resources</h1>
        <p className="text-muted-foreground">
          Helpful educational resources about sun protection and skin cancer prevention.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading resources...</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && resources.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No resources available at this time.</AlertDescription>
        </Alert>
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="grid gap-4">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold">{resource.title}</h3>
                  <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {resource.link}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
