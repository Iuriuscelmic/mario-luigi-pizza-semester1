function showContent(tabId) {
  // Hide all tab content
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => {
    content.classList.remove("active");
  });

  // Show the clicked tab content
  const activeContent = document.getElementById(tabId);
  activeContent.classList.add("active");
}
