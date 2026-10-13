import { getMenu } from "@/lib/menu";
import { SectionFilter } from "./components/SectionFilter/SectionFilter";
import { DishCard } from "./components/DishCard/DishCard";


export default async function MenuPage({ searchParams }: { searchParams: { section: string } }) {
    const menu = await getMenu();

    const section = (await searchParams).section;
    const active = menu.find((item) => item.slug === section) ?? menu[0];

    return (
        <div>
            <SectionFilter sections={menu} active={active.slug} />
            {active.dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
            ))}
        </div>
    );
}