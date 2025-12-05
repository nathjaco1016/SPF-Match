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
          Explore expert articles, guides, and helpful resources for sunscreen education and skin health.
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
                <h3>{resource.title}</h3>
              </CardHeader>
              <CardContent>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  {resource.link}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// export function ResourcesPage() {
//   return (
//     <div className="container mx-auto px-4 py-12 max-w-5xl">
//       <div className="mb-8">
//         <h1 className="mb-4">
//           Resources
//         </h1>
//         <p className="text-muted-foreground">
//           Explore expert articles, guides, and helpful resources for sunscreen education and skin health.
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         {resourceLinks.map((resource, index) => (
//           <Card
//             key={index}
//             className="hover:shadow-lg transition-shadow"
//           >
//             <CardContent className="pt-6">
//               <h3 className="mb-3">{resource.title}</h3>
//               <a
//                 href={resource.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 text-primary hover:underline"
//               >
//                 Read More
//                 <ExternalLink className="w-4 h-4" />
//               </a>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }