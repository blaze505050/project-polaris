import { SITE } from "./site";
import { LEARNING_CATALOG, type LearningItem } from "./learning";

export const SITE_URL = "https://projectpolaris.in";

/**
 * Global Organization & WebSite JSON-LD Schema
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "NGO"],
        "@id": `${SITE_URL}/#organization`,
        name: "Project Polaris",
        alternateName: ["Polaris", "Project Polaris India", "Project Polaris Ecosystem"],
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/polaris-logo.png`,
          contentUrl: `${SITE_URL}/polaris-logo.png`,
          caption: "Project Polaris Logo",
          width: 512,
          height: 512,
        },
        image: `${SITE_URL}/polaris-logo.png`,
        description: SITE.description,
        slogan: "Learn by building, rather than building after learning.",
        foundingDate: "2026-06-07",
        contactPoint: [
          {
            "@type": "ContactPoint",
            email: SITE.contactEmail,
            contactType: "Customer Support & Inquiries",
            areaServed: "IN",
            availableLanguage: ["English", "Hindi"],
          },
        ],
        sameAs: [
          SITE.instagramUrl,
          SITE.linkedinUrl,
          "https://github.com/blaze505050/project-polaris",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "Project Polaris",
        description: SITE.description,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/courses?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/**
 * Course and Workshop JSON-LD Schema for Courses Page & Catalog
 */
export function getCoursesSchema(items: LearningItem[] = LEARNING_CATALOG) {
  return {
    "@context": "https://schema.org",
    "@graph": items.map((item) => {
      if (item.type === "workshop") {
        return {
          "@type": "EducationEvent",
          "@id": `${SITE_URL}/courses#${item.id}`,
          name: item.title,
          description: item.description,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
          location: {
            "@type": "VirtualLocation",
            url: item.link || `${SITE_URL}/courses`,
          },
          organizer: {
            "@id": `${SITE_URL}/#organization`,
          },
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: item.link || `${SITE_URL}/courses`,
          },
          performer: item.instructor
            ? {
                "@type": "Person",
                name: item.instructor.name,
                jobTitle: item.instructor.title,
                worksFor: {
                  "@type": "Organization",
                  name: item.instructor.org,
                },
              }
            : undefined,
        };
      }

      return {
        "@type": "Course",
        "@id": `${SITE_URL}/courses#${item.id}`,
        name: item.title,
        description: item.description,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        educationalLevel: item.level === "all" ? "Beginner to Advanced" : item.level,
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          category: "Free Open Educational Resource",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: item.duration,
        },
      };
    }),
  };
}

/**
 * AeroForge AI Software Application Schema
 */
export function getAeroForgeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/aeroforge/#app`,
    name: "AeroForge AI",
    alternateName: "Polaris AeroForge Simulation Lab",
    url: `${SITE_URL}/aeroforge`,
    applicationCategory: "EngineeringApplication",
    operatingSystem: "All modern web browsers (Chrome, Edge, Firefox, Safari)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Browser-based aerospace and mechanical simulation workstation featuring 40+ numerical solvers, CFD aerodynamics, structural FEA, and orbital Keplerian physics.",
    creator: {
      "@id": `${SITE_URL}/#organization`,
    },
    softwareRequirements: "WebGL 2.0 or modern browser with JavaScript enabled",
  };
}

/**
 * BreadcrumbList Schema Generator
 */
export function getBreadcrumbSchema(breadcrumbs: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((bc, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: bc.name,
      item: bc.item.startsWith("http") ? bc.item : `${SITE_URL}${bc.item}`,
    })),
  };
}
