#!/usr/bin/env node
// Verifies real Markdown links associated with docs/knowledge. Backticked or
// plain-text paths are intentionally ignored so plans and templates may name
// prospective concepts without requiring empty placeholder files.
//
// Checks:
//   1. every local Markdown link authored inside the catalogue, and
//   2. every Markdown link from elsewhere in the repo that resolves into it.
//
// No dependencies—run with `node scripts/check-knowledge-links.mjs`.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

const repoRoot = resolve(import.meta.dirname, "..");
const kbDir = join(repoRoot, "docs", "knowledge");

const SKIP_DIRS = new Set([
	"node_modules",
	".git",
	".agents",
	".claude",
	".codex",
	".turbo",
	".next",
	"dist",
	"build",
	"coverage",
	".cache",
]);
const TEXT_EXT = new Set([
	".ts",
	".tsx",
	".js",
	".jsx",
	".mjs",
	".cjs",
	".md",
	".mdx",
	".json",
	".yml",
	".yaml",
]);

function walk(dir, files = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (!SKIP_DIRS.has(entry.name)) {
				walk(full, files);
			}
		} else if (entry.isFile()) {
			const dot = entry.name.lastIndexOf(".");
			if (dot !== -1 && TEXT_EXT.has(entry.name.slice(dot))) {
				files.push(full);
			}
		}
	}
	return files;
}

function isWithin(parent, target) {
	const child = relative(parent, target);
	return (
		child === "" ||
		(child !== ".." && !child.startsWith(`..${sep}`) && !isAbsolute(child))
	);
}

function markdownTargets(text) {
	const targets = [];
	const linkRe = /!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/g;
	for (const match of text.matchAll(linkRe)) {
		targets.push(match[1] ?? match[2]);
	}
	return targets;
}

function localTarget(sourceFile, rawTarget) {
	if (
		rawTarget.startsWith("#") ||
		rawTarget.startsWith("//") ||
		/^[A-Za-z][A-Za-z0-9+.-]*:/.test(rawTarget)
	) {
		return undefined;
	}

	const pathPart = rawTarget.split(/[?#]/, 1)[0];
	if (!pathPart) {
		return undefined;
	}

	let decoded;
	try {
		decoded = decodeURIComponent(pathPart);
	} catch {
		decoded = pathPart;
	}

	if (decoded.startsWith("/")) {
		const root = isWithin(kbDir, sourceFile) ? kbDir : repoRoot;
		return resolve(root, `.${decoded}`);
	}

	return resolve(dirname(sourceFile), decoded);
}

const problems = new Set();

if (existsSync(kbDir)) {
	for (const file of walk(repoRoot)) {
		const sourceIsInCatalogue = isWithin(kbDir, file);
		const text = readFileSync(file, "utf8");

		for (const rawTarget of markdownTargets(text)) {
			const target = localTarget(file, rawTarget);
			if (!target) {
				continue;
			}

			const targetIsInCatalogue = isWithin(kbDir, target);
			if (
				(sourceIsInCatalogue || targetIsInCatalogue) &&
				!existsSync(target)
			) {
				problems.add(`${relative(repoRoot, file)} -> ${rawTarget}`);
			}
		}
	}
}

if (problems.size > 0) {
	console.error("Broken knowledge-catalogue links:\n");
	for (const problem of problems) {
		console.error(`  x ${problem}`);
	}
	console.error(`\n${problems.size} broken link(s) found.`);
	process.exit(1);
}

console.log("All knowledge-catalogue links resolve.");
