import { marked } from "marked";
import { Link } from "react-router-dom";
import readmeRaw from "../../README.md?raw";

const html = marked.parse(readmeRaw, { async: false, breaks: true, gfm: true });

const Readme = () => {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">README</h1>
          <Link to="/" className="text-sm text-primary underline underline-offset-4">
            Voltar para Dashboard
          </Link>
        </div>

        <article
          className="max-w-none rounded-lg border border-border/50 bg-card p-6 text-foreground [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:mb-3 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-muted [&_pre]:p-3"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default Readme;
