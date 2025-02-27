import { Fragment } from "react";
// import { useRouter } from "next/router";

// import { getEventById } from "../../dummy-data";
import { getEventById, getFeaturedEvents } from "../../helpers/api-utils";
import EventSummary from "../../components/event-detail/event-summary";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventContent from "../../components/event-detail/event-content";
import ErrorAlert from "../../components/ui/error-alert";

function EventDetailPage(props) {
  // const router = useRouter();

  // const eventId = router.query.eventId;
  // const event = getEventById(eventId);
  const event = props.selectedEvent;

  if (!event) {
    return (
      <div className="center">
        <p>Loading ...</p>
      </div>
    );
  }

  return (
    <Fragment>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;

  const event = await getEventById(eventId);

  return {
    props: {
      selectedEvent: event,
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  const events = await getFeaturedEvents(); // fetching all events to pre-generate all featured pages could be a huge waste! (전체 데이터 가져오지 말고, api-utils파일에서 한번 필터링 거친 후에(isFeatured = true), 그 데이터를 가져오자!) => 이렇게 되면, fallback: true로 고쳐줘야 함. (피처이벤트만 보여주는 메인홈페이지에서는 상관없겟지만, 모든 데이터를 보여주는 /events페이지에서는 isFeatured: false인 이벤트의 상세페이지는 404가 뜨기 떄문..)
  const paths = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    paths: paths,
    fallback: "blocking", // specify하지 않은 unknown id로 접속한다면 404페이지 반환하도록 false로 설정..(명시하지 않은 페이지까지 동적으로 보여주려면 true(페이지 만드는데 시간 걸리므로 그동안 로딩페이지 보여줌) or 'blocking'(로딩페이지 없이, next.js는 데이터 준비될 때까지 기다렸다가 완전히 생성된 페이지를 한번에 뿌림 ...즉, 애초에 로딩페이지를 뿌려주지 못하는 설정)으로 설정)
  };
}

export default EventDetailPage;
