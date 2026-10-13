import { Dish } from "@/lib/menu";
import { Composition } from "./Composition";

export const DishCard = ({ dish }: { dish: Dish }) => {
    return (
        <article key={dish.id}>
            <h2>{dish.name}</h2>
            <p>{dish.price}</p>
            <p>{dish.weight}</p>
            <p>{dish.badge}</p>

            <Composition composition={dish.composition} />
        </article>
    );
};