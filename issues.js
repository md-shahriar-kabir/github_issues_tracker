const issuesApi = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = [];

async function loadIssues() {
    showSpinner(true);
    const res = await fetch(issuesApi)
    const data = await res.json()
    allIssues = data.data
    displayIssues(allIssues);
    showSpinner(false);
}

function showSpinner(state) {
    const spinner = document.getElementById("spinner");
    state ? spinner.classList.remove("hidden") : spinner.classList.add("hidden")
}

function displayIssues(issues) {
    document.getElementById("issueCount").innerText = issues.length
    const container = document.getElementById("issuesContainer");
    container.innerHTML = "";
    if (issues.length === 0) {
        container.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 py-12 px-6 text-center">
      <i class="fa-regular fa-face-frown text-6xl text-slate-300 mb-4"></i>
      <h3 class="text-xl font-bold text-slate-700 mb-2">No issues found</h3>
      <p class="text-slate-400 text-sm">Try searching with a different keyword.</p>
    </div>
  `;
        return;
    }
    issues.forEach(issue => {
        const border = issue.status === "open" ? "border-green-500" : "border-purple-500";
        const badgeIcon =
            issue.status === "open" ?
                {
                    icon: `
            <div class="w-7 h-7 flex items-center justify-center text-green-500 bg-green-100 rounded-full">
            <img src="./assets/Open-Status.png" alt="">
            </div>
        `,
                }
                : {
                    icon: `
          <div class="w-7 h-7 flex items-center justify-center text-purple-500 bg-purple-100 rounded-full">
            <img src="./assets/Closed-Status.png" alt=""></div>
        `,
                };
        const priorityColor = {
            high: "bg-red-100 text-red-600",
            medium: "bg-yellow-100 text-yellow-600",
            low: "bg-gray-200 text-gray-600"
        };

        let labelsHTML = "";
        if (issue.labels && issue.labels.length > 0) {
            labelsHTML = issue.labels.map(label => {
                if (label.toLowerCase() === "bug") {
                    return `<span class="badge badge-error">bug</span>`
                }
                if (label.toLowerCase() === "documentation") {
                    return `<span class="badge badge-info">documentation</span>`
                }
                if (label.toLowerCase() === "help wanted") {
                    return `<span class="badge badge-warning">help wanted</span>`
                }
                if (label.toLowerCase() === "enhancement") {
                    return `<span class="badge badge-success">enhancement</span>`
                }
                if (label.toLowerCase() === "good first issue") {
                    return `<span class="badge badge-accent">good first issue</span>`
                }
                return `<span class="badge badge-success">${label}</span>`

            }).join("")
        }

        const card = document.createElement("div");
        card.innerHTML = `
        <div onclick="showIssueDetails(${issue.id})" class="bg-white p-5 rounded-xl shadow border-t-4 ${border} cursor-pointer hover:shadow-lg transition">
            <div class="flex justify-between mb-3">
                ${badgeIcon.icon}
                <span class="text-xs px-3 py-1 rounded-full ${priorityColor[issue.priority]}">
                    ${issue.priority.toUpperCase()}
                </span>
            </div>
            <h2 class="font-semibold text-lg mb-2 truncate">
                    ${issue.title}
            </h2>
            <p class="text-gray-500 text-sm mb-3 truncate">
                    ${issue.description}
            </p>
            <div class="flex gap-2 mb-3 ">
                    ${labelsHTML}
            </div>
            <div class="divider"></div>
            <div class="flex justify-between mb-3">
                <p class="text-xs text-gray-500">
                    #${issue.id} by ${issue.author}
                </p>
                <p class="text-xs text-gray-500">
                    ${issue.createdAt}
                </p>
            </div>
            <div class="flex justify-between">
                <p class="text-xs text-gray-500">
                    Assignee: ${issue.assignee ? issue.assignee : "N/A"}
                </p>
                <p class="text-xs text-gray-500">
                    ${issue.updatedAt}
                </p>
            </div>    
        </div>
    `
        container.appendChild(card)
    })
}

function filterIssues(status, btn) {
    setActive(btn)
    if (status === "all") {
        displayIssues(allIssues)
        return
    }
    const filtered = allIssues.filter(i => i.status === status)
    displayIssues(filtered)

}

function setActive(btn) {
    ["allBtn", "openBtn", "closedBtn"].forEach(id => {
        document.getElementById(id).classList.remove("bg-[#4A00FF]", "text-white")
    })
    document.getElementById(btn).classList.add("bg-[#4A00FF]", "text-white")
}

function searchIssue() {
    const text = document.getElementById("searchInput").value;

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`)
        .then(res => res.json())
        .then(data => displayIssues(data.data))
}

async function showIssueDetails(id) {
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    const data = await res.json()
    const issue = data.data
    const priorityColor = {
        high: "bg-red-100 text-red-600",
        medium: "bg-yellow-100 text-yellow-600",
        low: "bg-gray-200 text-gray-600"
    };

    let labelsHTML = "";
        if (issue.labels && issue.labels.length > 0) {
            labelsHTML = issue.labels.map(label => {
                if (label.toLowerCase() === "bug") {
                    return `<span class="badge badge-error">bug</span>`
                }
                if (label.toLowerCase() === "documentation") {
                    return `<span class="badge badge-info">documentation</span>`
                }

                if (label.toLowerCase() === "help wanted") {
                    return `<span class="badge badge-warning">help wanted</span>`
                }
                if (label.toLowerCase() === "enhancement") {
                    return `<span class="badge badge-success">enhancement</span>`
                }
                if (label.toLowerCase() === "good first issue") {
                    return `<span class="badge badge-accent">good first issue</span>`
                }
                return `<span class="badge badge-success">${label}</span>`
            }).join("")
        }

    const statusColor = issue.status === "open" ? "bg-green-500 text-white" : "bg-red-600 text-white";

    document.getElementById("modalContent").innerHTML = `

            <h2 class="text-2xl font-bold mb-4">
                ${issue.title}
            </h2>
            <div class="flex items-center gap-3 text-sm mb-4">
                <span class="px-3 py-1 rounded-full ${statusColor} font-medium">
                    ${issue.status}
                </span>
                <span class="text-gray-500">
                    Opened by ${issue.author}
                </span>
                <span class="text-gray-400">
                    • ${issue.createdAt}
                </span>
            </div>
                <div class="flex gap-2 mb-5">
                    ${labelsHTML}
                </div>
                <p class="text-gray-600 mb-6">
                    ${issue.description}
                </p>
        <div class="bg-gray-100 p-4 rounded-lg flex justify-between">
            <div>
                <p class="text-gray-500 text-sm">
                    Assignee:
                </p>
                <p class="font-semibold">
                    ${issue.assignee ? issue.assignee : "N/A"}
                </p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">
                    Priority:
                </p>
                <span class="px-3 py-1 rounded-full ${priorityColor[issue.priority]} text-l">
                    ${issue.priority.toUpperCase()}
                </span>
            </div>
        </div>
            <div class="flex justify-end mt-6">
                <form method="dialog">
                <button class="btn btn-primary px-6">
                    Close
                </button>
                </form>
            </div>

`
    document.getElementById("issueModal").showModal()

}
loadIssues()