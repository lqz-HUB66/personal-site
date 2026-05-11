import { Github, Mail } from "lucide-react";

interface FooterProps {
  github?: string;
  email?: string;
}

export default function Footer({ github, email }: FooterProps) {
  return (
    <footer className="border-t border-[#222] mt-20 relative z-10">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted)]">
        <p>&copy; {new Date().getFullYear()} 版权所有</p>
        <div className="flex items-center gap-4">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="hover:text-white transition-colors"
              aria-label="邮箱"
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
