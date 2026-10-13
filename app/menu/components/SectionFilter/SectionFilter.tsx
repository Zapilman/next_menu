import Link from "next/link";

export const SectionFilter = ({ sections, active }: { sections: { slug: string, title: string }[], active: string }) => {
    return (
        <nav>
            <ul>
                {sections.map((section) => (
                    <li key={section.slug}>
                        <Link href={`/menu?section=${section.slug}`} className={active === section.slug ? "active" : ""}>{section.title}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};