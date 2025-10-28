import { Card, CardContent, CardHeader } from "../assets/card";
import { ExternalLink } from "lucide-react";

const blogLinks = [
  {
    title: "The Complete Guide to Sunscreen",
    description:
      "Learn about different types of sunscreen, SPF ratings, and how to choose the right one for you.",
    url: "https://www.aad.org/public/everyday-care/sun-protection/sunscreen-patients/how-to-select-sunscreen",
    source: "American Academy of Dermatology",
  },
  {
    title: "Understanding the Fitzpatrick Skin Type Scale",
    description:
      "A comprehensive guide to the Fitzpatrick scale and how it relates to sun protection.",
    url: "https://www.skincancer.org/blog/ask-the-expert-does-a-higher-spf-sunscreen-always-protect-your-skin-better/",
    source: "Skin Cancer Foundation",
  },
  {
    title: "How to Apply Sunscreen Correctly",
    description:
      "Step-by-step instructions on proper sunscreen application for maximum protection.",
    url: "https://www.cancer.org/cancer/risk-prevention/sun-and-uv/sun-protection.html",
    source: "American Cancer Society",
  },
  {
    title:
      "Mineral vs. Chemical Sunscreen: What's the Difference?",
    description:
      "Compare physical and chemical sunscreens to find out which is best for your skin.",
    url: "https://www.fda.gov/drugs/understanding-over-counter-medicines/sunscreen-how-help-protect-your-skin-sun",
    source: "FDA",
  },
  {
    title: "Sunscreen Myths Debunked",
    description:
      "Common misconceptions about sunscreen and sun protection explained by dermatologists.",
    url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/best-sunscreen/art-20045110",
    source: "Mayo Clinic",
  },
  {
    title: "Sunscreen for Different Skin Types",
    description:
      "Find the best sunscreen formulation for oily, dry, sensitive, and combination skin.",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3543289/",
    source: "National Institutes of Health",
  },
  {
    title: "Water-Resistant vs. Waterproof Sunscreen",
    description:
      "Understanding sunscreen labels and what they mean for your activities.",
    url: "https://www.ewg.org/sunscreen/",
    source: "Environmental Working Group",
  },
  {
    title: "Year-Round Sun Protection Tips",
    description:
      "Why you need sunscreen even in winter and on cloudy days.",
    url: "https://www.cdc.gov/cancer/skin/basic_info/sun-safety.htm",
    source: "CDC",
  },
];

export function BlogsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="mb-4">
          Sunscreen Education & Resources
        </h1>
        <p className="text-muted-foreground">
          Explore these expert articles and guides to learn more
          about sunscreen, UV protection, and proper skin care
          in the sun.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {blogLinks.map((blog, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <h3 className="mb-2">{blog.title}</h3>
              <p className="text-sm text-muted-foreground">
                {blog.source}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {blog.description}
              </p>
              <a
                href={blog.url}
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