import BtnAddFavorite from "@/components/shared/BtnAddFavorite";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { getWishlist } from "@/lib/actions/user.actions";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function EventDetail({
  params: { id },
  searchParams,
}: SearchParamProps) {
  const event = await getEventById(id);

  //! Récupérer les events liés à la catégorie de l'event actuel
  const relaledEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  });

  //! Récupérer l'ID de la personnne connecté pour afficher si l'event est dans ses favoris et les afficher
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  let isFavorite = false;
  if (userId) {
    const favoriteEvent = await getWishlist({ userId, page: 1 });
    isFavorite = favoriteEvent.some(
      (favorite: any) => favorite._id === event._id
    );
  }

  //! Vérifier si l'event est passé ou pas :
  const currentDateTime = new Date();
  const endDateTime = new Date(event.endDateTime);
  const isPastEvent = currentDateTime > endDateTime;

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event?.imageUrl} // Configurer le fichier next.config.js pour les images venant du serveur UploadThing
            alt={event?.title}
            width={1000}
            height={1000}
            className="h-full min-g-[300px] object-cover object-center"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-200 px-5 py-2 text-green-700">
                    {event.isFree ? "Gratuit" : `${event.price} €`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{" "}
                  <Link
                    href={`/profil/${event.organizer._id}`}
                    className="text-primary-500"
                  >
                    {event.organizer.firstName} {event.organizer.lastName}
                  </Link>
                </p>
              </div>
            </div>
            {/* Checkout Button */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="Calendar Icon"
                  width={32}
                  height={32}
                />
                {isPastEvent ? (
                  <p className="p-medium-16 lg:p-medium-20 text-red-400 flex flex-wrap items-center">
                    Cette événement s&apos;est terminé le{" "}
                    {new Date(event.endDateTime).toLocaleDateString("fr-FR")}
                  </p>
                ) : (
                  <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center gap-1">
                    <p>
                      {formatDateTime(event.startDateTime).dateOnly} -{" "}
                      {formatDateTime(event.startDateTime).timeOnly} |{" "}
                    </p>
                    <p>
                      {formatDateTime(event.endDateTime).dateOnly} -{" "}
                      {formatDateTime(event.endDateTime).timeOnly}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="Location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
              <div className="flex justify-center items-center gap-8">
                <Link href={event.url} className="w-full">
                  <Button className="rounded-full w-full">
                    Prendre mon billet
                  </Button>
                </Link>
                <BtnAddFavorite isFavorite={isFavorite} event={event} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">
                Ce qu&apos;il faut savoir :{" "}
              </p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>

              {/* <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
                {event.url}
              </p> */}
            </div>
          </div>
        </div>
      </section>

      {/* EVENT FROM THE SAME ORGANIZER */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">D&apos;autres événements</h2>

        <Collection
          data={relaledEvents?.data}
          emptyTitle="Aucun Event Trouvé"
          emptyStateSubtext="Revenir plus tard"
          collectionType="All_Events"
          limit={6}
          page={1}
          totalPages={2}
        />
      </section>
    </>
  );
}
