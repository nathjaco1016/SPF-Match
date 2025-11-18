import { Card, CardContent } from "../assets/card";
import { ExternalLink } from "lucide-react";

const resourceLinks = [
  {
    title: "The Complete Guide to Sunscreen",
    url: "https://www.aad.org/public/everyday-care/sun-protection/sunscreen-patients/how-to-select-sunscreen",
  },
  {
    title: "Understanding the Fitzpatrick Skin Type Scale",
    url: "https://www.skincancer.org/blog/ask-the-expert-does-a-higher-spf-sunscreen-always-protect-your-skin-better/",
  },
  {
    title: "How to Apply Sunscreen Correctly",
    url: "https://www.cancer.org/cancer/risk-prevention/sun-and-uv/sun-protection.html",
  },
  {
    title:
      "Mineral vs. Chemical Sunscreen: What's the Difference?",
    url: "https://www.fda.gov/drugs/understanding-over-counter-medicines/sunscreen-how-help-protect-your-skin-sun",
  },
  {
    title: "Sunscreen Myths Debunked",
    url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/best-sunscreen/art-20045110",
  },
  {
    title: "Sunscreen for Different Skin Types",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3543289/",
  },
  {
    title: "Water-Resistant vs. Waterproof Sunscreen",
    url: "https://www.ewg.org/sunscreen/",
  },
  {
    title: "Year-Round Sun Protection Tips",
    url: "https://www.cdc.gov/cancer/skin/basic_info/sun-safety.htm",
  },
];

export function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="mb-4">
          Resources
        </h1>
        <p className="text-muted-foreground">
          Explore expert articles, guides, and helpful resources for sunscreen education and skin health.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {resourceLinks.map((resource, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="pt-6">
              <h3 className="mb-3">{resource.title}</h3>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Read More
                <ExternalLink className="w-4 h-4" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
