"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ResourceAction, ResourceKind } from "@/content/library/catalog";

export type LibraryCategoryView = {
  id: string;
  title: string;
  description: string;
};

export type LibraryResourceView = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  benefit: string;
  kind: ResourceKind;
  action: ResourceAction;
  href: string;
  filename: string;
  formatLabel: string;
  pages?: number;
  fillable: boolean;
  featured: boolean;
  imageAlt?: string;
  relatedIds: string[];
};

type LibraryLabels = {
  searchLabel: string;
  searchPlaceholder: string;
  allCategories: string;
  featured: string;
  categoriesLabel: string;
  empty: string;
  fillable: string;
  related: string;
  results: string;
  kinds: Record<ResourceKind, string>;
  actions: Record<ResourceAction, string>;
  pagesOne: string;
  pagesMany: string;
};

type ResourceLibraryProps = {
  categories: LibraryCategoryView[];
  resources: LibraryResourceView[];
  labels: LibraryLabels;
};

function downloads(action: ResourceAction): boolean {
  return action.startsWith("download");
}

export function ResourceLibrary({ categories, resources, labels }: ResourceLibraryProps) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter((resource) => {
      if (categoryId !== "all" && resource.categoryId !== categoryId) {
        return false;
      }
      if (!needle) {
        return true;
      }
      const haystack = `${resource.title} ${resource.description} ${resource.benefit} ${labels.kinds[resource.kind]}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [categoryId, labels.kinds, query, resources]);

  const featured = resources.filter((resource) => resource.featured);
  const showFeatured = categoryId === "all" && query.trim() === "";
  const titleById = new Map(resources.map((resource) => [resource.id, resource.title]));

  function showRelated(id: string) {
    setQuery("");
    setCategoryId("all");
    window.setTimeout(() => {
      const card = document.getElementById(`resource-${id}`);
      card?.scrollIntoView({ behavior: "smooth", block: "start" });
      card?.focus();
    }, 0);
  }

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1">
          <label htmlFor="resource-search" className="text-sm font-medium text-navy">
            {labels.searchLabel}
          </label>
          <input
            id="resource-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="mt-2 w-full rounded-md border border-border bg-card px-4 py-3 text-base text-navy outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          />
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {labels.results.replace("{count}", String(visible.length))}
        </p>
      </div>

      <div className="mt-6" role="group" aria-label={labels.categoriesLabel}>
        <div className="flex flex-wrap gap-2">
          <CategoryButton
            pressed={categoryId === "all"}
            onClick={() => setCategoryId("all")}
          >
            {labels.allCategories}
          </CategoryButton>
          {categories.map((category) => (
            <CategoryButton
              key={category.id}
              pressed={categoryId === category.id}
              onClick={() => setCategoryId(category.id)}
            >
              {category.title}
            </CategoryButton>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-base leading-relaxed text-muted" role="status">
          {labels.empty}
        </p>
      ) : null}

      {showFeatured ? (
        <section className="mt-12" aria-labelledby="featured-resources">
          <h2 id="featured-resources" className="text-2xl font-semibold tracking-tight text-navy">
            {labels.featured}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((resource) => (
              <ResourceCard
                key={`featured-${resource.id}`}
                resource={resource}
                labels={labels}
                titleById={titleById}
                onRelated={showRelated}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {categories.map((category) => {
        const items = visible.filter((resource) => resource.categoryId === category.id);
        if (items.length === 0) {
          return null;
        }
        return (
          <section
            key={category.id}
            id={category.id}
            className="mt-14 scroll-mt-28"
            aria-labelledby={`${category.id}-title`}
          >
            <h2 id={`${category.id}-title`} className="text-2xl font-semibold tracking-tight text-navy">
              {category.title}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">{category.description}</p>
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  labels={labels}
                  titleById={titleById}
                  onRelated={showRelated}
                  anchor
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function CategoryButton({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
        pressed
          ? "border-navy bg-navy text-white"
          : "border-border bg-card text-navy hover:border-navy/25"
      }`}
    >
      {children}
    </button>
  );
}

function ResourceCard({
  resource,
  labels,
  titleById,
  onRelated,
  anchor = false,
}: {
  resource: LibraryResourceView;
  labels: LibraryLabels;
  titleById: Map<string, string>;
  onRelated: (id: string) => void;
  anchor?: boolean;
}) {
  const related = resource.relatedIds.flatMap((id) => {
    const title = titleById.get(id);
    return title ? [{ id, title }] : [];
  });
  const meta = [
    labels.kinds[resource.kind],
    resource.formatLabel,
    resource.pages
      ? resource.pages === 1
        ? labels.pagesOne
        : labels.pagesMany.replace("{count}", String(resource.pages))
      : null,
  ].filter(Boolean);

  return (
    <li
      id={anchor ? `resource-${resource.id}` : undefined}
      tabIndex={anchor ? -1 : undefined}
      className="flex h-full scroll-mt-28 flex-col rounded-2xl border border-border bg-card px-5 py-5 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
    >
      <p className="text-xs font-medium tracking-[0.14em] text-blue uppercase">{meta.join(" · ")}</p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-navy">{resource.title}</h3>
      <p className="mt-3 text-base leading-relaxed text-muted">{resource.description}</p>
      <p className="mt-3 text-sm leading-relaxed text-navy">{resource.benefit}</p>
      {resource.imageAlt ? (
        <Image
          src={resource.href}
          alt={resource.imageAlt}
          width={1536}
          height={1024}
          className="mt-4 h-auto w-full rounded-lg border border-border bg-white object-contain"
        />
      ) : null}
      {resource.fillable ? (
        <p className="mt-3 text-sm leading-relaxed text-muted">{labels.fillable}</p>
      ) : null}
      {related.length > 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          <span className="font-medium text-navy">{labels.related}</span>{" "}
          {related.map((item, index) => (
            <span key={item.id}>
              {index > 0 ? ", " : null}
              <button
                type="button"
                onClick={() => onRelated(item.id)}
                className="font-medium text-blue underline-offset-4 hover:underline"
              >
                {item.title}
              </button>
            </span>
          ))}
        </p>
      ) : null}
      <div className="mt-auto pt-5">
        <a
          href={resource.href}
          {...(downloads(resource.action)
            ? { download: resource.filename }
            : { target: "_blank", rel: "noopener noreferrer" })}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium tracking-wide text-navy transition-colors hover:border-navy/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          {labels.actions[resource.action]}
        </a>
      </div>
    </li>
  );
}
