import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
  acknowledgedUnlistedFiles,
  libraryCategories,
  libraryResources,
  resourceHref,
} from "../content/library/catalog.ts";

const root = path.join(process.cwd(), "public", "resources", "categories");
const errors: string[] = [];

function fail(message: string) {
  errors.push(message);
}

const categoryIds = new Set<string>();
for (const category of libraryCategories) {
  if (categoryIds.has(category.id)) {
    fail(`Duplicate category id: ${category.id}`);
  }
  categoryIds.add(category.id);
}

const resourceIds = new Set<string>();
const fileKeys = new Set<string>();

for (const resource of libraryResources) {
  if (resourceIds.has(resource.id)) {
    fail(`Duplicate resource id: ${resource.id}`);
  }
  resourceIds.add(resource.id);

  if (!categoryIds.has(resource.categoryId)) {
    fail(`${resource.id} uses unknown category ${resource.categoryId}`);
  }

  const key = `${resource.folder}/${resource.filename}`;
  if (fileKeys.has(key)) {
    fail(`Duplicate file reference: ${key}`);
  }
  fileKeys.add(key);

  const diskPath = path.join(root, resource.folder, resource.filename);
  if (!existsSync(diskPath)) {
    fail(`${resource.id} is missing on disk: ${diskPath}`);
  }

  const href = resourceHref(resource);
  if (href.includes("/Users/") || href.includes("\\")) {
    fail(`${resource.id} exposes a filesystem path: ${href}`);
  }
  if (!href.startsWith("/resources/categories/")) {
    fail(`${resource.id} has an invalid public path: ${href}`);
  }

  const extension = resource.filename.split(".").pop()?.toLowerCase();
  if (extension !== resource.format) {
    fail(`${resource.id} format ${resource.format} does not match ${resource.filename}`);
  }

  for (const relatedId of resource.relatedIds ?? []) {
    if (!libraryResources.some((item) => item.id === relatedId)) {
      fail(`${resource.id} links to missing related resource ${relatedId}`);
    }
  }
}

for (const extra of acknowledgedUnlistedFiles) {
  const diskPath = path.join(root, extra.folder, extra.filename);
  if (!existsSync(diskPath)) {
    fail(`Acknowledged file is missing: ${extra.folder}/${extra.filename}`);
  }
}

function walk(directory: string) {
  for (const entry of readdirSync(directory)) {
    if (entry === ".DS_Store" || entry.startsWith("~$")) {
      continue;
    }
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      walk(fullPath);
      continue;
    }
    const extension = entry.split(".").pop()?.toLowerCase();
    if (extension !== "pdf" && extension !== "png") {
      fail(`Unexpected file type: ${path.relative(root, fullPath)}`);
      continue;
    }
    const folder = path.relative(root, directory);
    const listed = libraryResources.some(
      (resource) => resource.folder === folder && resource.filename === entry,
    );
    const acknowledged = acknowledgedUnlistedFiles.some(
      (file) => file.folder === folder && file.filename === entry,
    );
    if (!listed && !acknowledged) {
      fail(`File is not in the catalog: ${folder}/${entry}`);
    }
  }
}

walk(root);

if (errors.length > 0) {
  console.error(`Resource library validation failed (${errors.length}):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Resource library OK: ${libraryResources.length} resources, ${libraryCategories.length} categories.`,
);
