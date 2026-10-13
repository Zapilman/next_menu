import { getVenue } from "@/lib/menu";


export const VenueInfo = async () => {
    const venue = await getVenue();

    return (
        <div>
            <h1>{venue.name}</h1>
            <p>{venue.address}</p>
            <p>{venue.hours}</p>
            <p>{venue.phone}</p>
        </div>
    );
};