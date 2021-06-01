$(() => {
  //   //Mark Story Complete Handler
  $(document).on("click", ".mark-complete-btn", function () {
    const story_id = $(this).closest("article[data-id]").attr("data-id");
    $.post(`/stories/${story_id}`, { story_id: story_id })
      .then(() => {
        $.get(`/stories/${story_id}`)
          .then((data) => {
            const { story } = data;
            $(".content-container").empty();
            renderViewedStory(story, ".content-container", false);
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  });
});