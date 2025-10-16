import React, { useEffect, useState, useMemo } from "react";
import { AuroraBackground } from "../components/ui/aurora-background";
import { getData } from "../api";
import { useParams } from "react-router-dom";

export default function Artifacts() {
  const { workspaceId } = useParams();
  const [fadeIn, setFadeIn] = useState(false);
  const [artifacts, setArtifacts] = useState([]);
  const [role, setRole] = useState("");
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [expandedTypes, setExpandedTypes] = useState([]);
  const [pipelineDetails, setPipelineDetails] = useState(null);

  const allowedTypes = [
    "warehouse",
    "report",
    "paginatedreport",
    "lakehouse",
    "datapipeline",
    "notebook",
    "dashboard",
  ];

  useEffect(() => {
    setFadeIn(true);
    const fetchArtifacts = async () => {
      try {
        const resp = await getData(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/default/artifacts/${workspaceId}`
        );
        const resp2 = await getData(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/default/getPermissions/${workspaceId}`
        );
        const data2 = resp2?.data?.roles || [];
        setRole(data2[0]?.role || "");
        const data = resp?.data?.artifacts || [];
        const flattened = Array.isArray(data)
          ? data.flat(Infinity).filter(Boolean)
          : [];
        setArtifacts(flattened);
      } catch (error) {
        console.error(error);
      }
    };
    if (workspaceId) fetchArtifacts();
  }, [workspaceId]);

  const types = useMemo(() => {
    return Array.from(
      new Set(
        artifacts
          .map((a) => a?.type?.toLowerCase())
          .filter((t) => allowedTypes.includes(t))
      )
    ).sort();
  }, [artifacts]);

  const handleArtifactClick = async (artifact) => {
  setSelectedArtifact(artifact);
  setPipelineDetails(null);

  if (artifact.type?.toLowerCase() === "datapipeline") {
    try {
      const resp = await getData(
        `${import.meta.env.VITE_BASE_URL}/api/default/getPipelineDetails/${workspaceId}/${artifact.id}`
      );
      setPipelineDetails(resp.data || resp);
      console.log(resp.data || resp);
    } catch (err) {
      console.error(err);
      setPipelineDetails({ error: "Failed to fetch pipeline details" });
    }
  }
};


  return (
    <AuroraBackground>
      <div
        className={`flex min-h-screen transition-all duration-700 ease-in-out ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Fixed Left Sidebar */}
        <aside className="fixed top-0 left-0 w-56 h-full bg-white/90 backdrop-blur-md border-r border-gray-200 p-4 overflow-y-auto z-20">
          <h2 className="font-bold text-lg mb-4 flex items-center justify-between">
            Artifacts
            {role && (
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                {role}
              </span>
            )}
          </h2>
          {types.map((type) => (
            <div key={type}>
              <div
                className="cursor-pointer font-semibold py-1 px-2 hover:bg-indigo-100 rounded"
                onClick={() =>
                  setExpandedTypes((prev) =>
                    prev.includes(type)
                      ? prev.filter((t) => t !== type)
                      : [...prev, type]
                  )
                }
              >
                {type}
              </div>
              {expandedTypes.includes(type) && (
                <div className="ml-4 mt-1 space-y-1">
                  {artifacts
                    .filter((a) => a.type?.toLowerCase() === type)
                    .map(({ id, displayName, type }) => (
                      <div
                        key={id}
                        className={`cursor-pointer py-1 px-2 rounded hover:bg-indigo-200 ${
                          selectedArtifact?.id === id
                            ? "bg-indigo-100 font-bold"
                            : ""
                        }`}
                        onClick={() => handleArtifactClick({ id, type })}
                      >
                        {displayName}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 ml-56 overflow-auto">
          {selectedArtifact ? (
            selectedArtifact.type?.toLowerCase() === "report" ||
            selectedArtifact.type?.toLowerCase() === "paginatedreport" ? (
              <iframe
                title="Report Viewer"
                width="100%"
                height="600"
                className="w-full h-full"
                src={`https://app.powerbi.com/reportEmbed?reportId=${selectedArtifact.id}&groupId=${selectedArtifact.workspaceId}&autoAuth=true`}
                frameBorder="0"
                allowFullScreen
              />
            ) : selectedArtifact.type?.toLowerCase() === "datapipeline" ? (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(pipelineDetails, null, 2)}
              </pre>
            ) : (
              <div className="space-y-4 text-gray-700">
                <h3 className="font-bold text-xl">
                  {selectedArtifact.displayName}
                </h3>
                <p>Type: {selectedArtifact.type}</p>
                <p>Workspace ID: {selectedArtifact.workspaceId}</p>
                <p>Folder ID: {selectedArtifact.folderId || "-"}</p>
                <p>
                  Description:{" "}
                  {selectedArtifact.description || "No description available"}
                </p>
              </div>
            )
          ) : (
            <p className="text-gray-400">
              Select an artifact from the left pane to view details, visualize a
              report, or see pipeline history.
            </p>
          )}
        </main>
      </div>
    </AuroraBackground>
  );
}
