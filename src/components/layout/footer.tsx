import Link from 'next/link';
import {
  Mail,
  Instagram,
  Facebook,
  MessageCircle,
  Gamepad2,
  CalendarDays,
  Image,
  BookOpen,
  Home,
  Github,
  Globe,
} from 'lucide-react';
import { CurrentYear } from '../common/current-year';
import ScrollAnimationWrapper from '../shared/scroll-animation-wrapper';

const creators = [
  {
    name: 'J.P da Silva',
    href: 'https://github.com/officialjp',
    icon: Github,
  },
  { name: 'Michael', href: 'https://natski.dev', icon: Globe },
  { name: 'Maiham', href: '', icon: null },
  { name: 'David', href: 'https://github.com/BLT19', icon: Github },
];

const quickLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Games', href: '/games', icon: Gamepad2 },
  { name: 'Events', href: '/events', icon: CalendarDays },
  { name: 'Gallery', href: '/gallery', icon: Image },
  { name: 'Library', href: '/library', icon: BookOpen },
];

const socials = [
  {
    name: 'Ussu.Anime@surrey.ac.uk',
    href: 'mailto:Ussu.Anime@surrey.ac.uk',
    icon: Mail,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/unisamsoc/?hl=en',
    icon: Instagram,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/UniSAMSoc',
    icon: Facebook,
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/tQUrdxzUZ4',
    icon: MessageCircle,
  },
];

export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-linear-to-br from-gradient1 via-gradient2 to-gradient4">
      <div className="container mx-auto w-full max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Column 1: Brand */}
          <ScrollAnimationWrapper variant="fadeInUp" delay={0}>
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="inline-flex w-fit items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                SAMSoc
              </Link>
              <p className="text-sm font-medium text-text1">
                Bringing anime fans together since 2006
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-text1/70">
                  Created by
                </p>
                <div className="flex flex-wrap gap-2">
                  {creators.map((creator) => {
                    const CreatorIcon = creator.icon;
                    return creator.href ? (
                      <Link
                        key={creator.name}
                        href={creator.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-black bg-about1 px-3 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                      >
                        {CreatorIcon && (
                          <CreatorIcon className="size-3" />
                        )}
                        {creator.name}
                      </Link>
                    ) : (
                      <span
                        key={creator.name}
                        className="inline-flex items-center gap-1.5 rounded-full border border-black bg-about2 px-3 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        {creator.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Column 2: Quick Links */}
          <ScrollAnimationWrapper variant="fadeInUp" delay={100}>
            <div className="flex-col gap-4 hidden lg:flex">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text1">
                Quick Links
              </h3>
              <nav className="flex flex-col gap-2">
                {quickLinks.map((link) => {
                  const LinkIcon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="inline-flex w-fit items-center gap-2 rounded-lg border-2 border-transparent px-3 py-1.5 text-sm font-medium text-text1 transition-all hover:border-black hover:bg-purple-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <LinkIcon className="size-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </ScrollAnimationWrapper>

          {/* Column 3: Contact & Socials */}
          <ScrollAnimationWrapper variant="fadeInUp" delay={200}>
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text1">
                Connect With Us
              </h3>
              <nav className="flex flex-col gap-3">
                {socials.map((social) => {
                  const SocialIcon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target={
                        social.href.startsWith(
                          'mailto:',
                        )
                          ? undefined
                          : '_blank'
                      }
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-3 rounded-xl border-2 border-black bg-white/70 px-4 py-2 text-sm font-medium shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-white hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <SocialIcon className="size-5 shrink-0" />
                      {social.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t-2 border-black/20 px-4 py-6 text-center">
        <p className="text-sm font-medium text-text1/80">
          &copy; <CurrentYear /> University of Surrey Anime and Manga
          Society. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
