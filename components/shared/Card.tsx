import { IEvent } from "@/lib/mongoDb/database/models/Event";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { DeleteConfirmation } from "./DeleteConfirmation";
import BtnAddFavorite from "./BtnAddFavorite";
import { getWishlist } from "@/lib/actions/user.actions";

type CardProps = {
  event: IEvent;
  hasOrderLink: boolean;
  hidePrice: boolean;
  removeFavorite: boolean;
};

const Card = async ({
  event,
  hasOrderLink,
  hidePrice,
  removeFavorite,
}: CardProps) => {
  //! Vérifier si l'ID du User actuelle correspond au userId d'un event --> pour afficher l'event différemment
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  let isFavorite = false;

  if (userId) {
    //! Réupération du tableau des favoris de l'utilisateur
    const favoriteEvent = await getWishlist({ userId, page: 1 });
    // console.log("WISHLIST ---- ", favoriteEvent);

    //! Véririe si l'event est dans les favoris de l'utilisateur : renvoie TRUE ou FALSE
    isFavorite = favoriteEvent.some(
      (favorite: any) => favorite._id === event._id
    );
  }

  //! Vérifier si le User est le créateur de l'event
  const isEventCreator =
    event.organizer && event.organizer._id
      ? userId === event.organizer._id.toString()
      : false;
  // console.log("USER ID ---- ", userId);

  //! Vérifier si l'event est passé ou pas :
  const currentDateTime = new Date();
  const endDateTime = new Date(event.endDateTime);
  const isPastEvent = currentDateTime > endDateTime;

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl}` }}
        className="flex-center flex-grow bg-grey-50 bg-cover bg-center text-grey-500"
      />
      {/* IS EVENT CREATOR */}
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>

          <DeleteConfirmation eventId={event._id} />
        </div>
      )}
      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600">
              {event.isFree ? "Gratuit" : `${event.price}€`}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-gre-500/10 px-4 py-1 text-grey-500 line-clamp-1">
              {event.category.name}
            </p>
          </div>
        )}

        <div className="flex justify-between gap-4">
          {isPastEvent ? (
            <p className="p-medium-14 text-red-400">
              Cette événement s&apos;est terminé le{" "}
              {new Date(event.endDateTime).toLocaleDateString("fr-FR")}
            </p>
          ) : (
            <div className="w-full flex justify-between">
              <p className="p-medium-14 p-medium-18 text-grey-500">
                {formatDateTime(event.startDateTime).dateTime}
              </p>

              <p className="p-medium-14 p-medium-18 text-grey-500">
                {event.location}
              </p>
            </div>
          )}
        </div>

        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {event.title}
          </p>
        </Link>

        <div className="flex-between w-full">
          <Link
            href={`/profil/${event.organizer._id}`}
            className="p-medium-14 md:p-medium-16 text-grey-600"
          >
            {event.organizer.firstName} {event.organizer.lastName}
          </Link>

          {/* {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className=" text-primary-500">Order Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="search"
                width={10}
                height={10}
              />
            </Link>
          )} */}

          <BtnAddFavorite isFavorite={isFavorite} event={event} />
        </div>
      </div>
    </div>
  );
};

export default Card;
