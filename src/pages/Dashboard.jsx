import React, { useEffect, useState } from "react";
import { AuroraBackground } from "../components/ui/aurora-background";
import { getData, postData } from "../api";
import Button from "../components/Button";

export default function Dashboard() {
  const [fadeIn, setFadeIn] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState([]);
  const [artifactsMap, setArtifactsMap] = useState({});
  const [roleMap, setRoleMap] = useState({});
  const [expandedTypesMap, setExpandedTypesMap] = useState({});
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [pipelineDetails, setPipelineDetails] = useState([]);

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
    const fetchWorkspaces = async () => {
      try {
        const resp = await getData(
          `${import.meta.env.VITE_BASE_URL}/api/default/workspaces`
        );
        setWorkspaces(resp.data.workspaces || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWorkspaces();
  }, []);

  const fetchArtifacts = async (workspaceId) => {
    try {
      const [resp, resp2] = await Promise.all([
        getData(
          `${import.meta.env.VITE_BASE_URL}/api/default/artifacts/${workspaceId}`
        ),
        getData(
          `${import.meta.env.VITE_BASE_URL}/api/default/getPermissions/${workspaceId}`
        ),
      ]);
      const flattened = Array.isArray(resp?.data?.artifacts)
        ? resp.data.artifacts.flat(Infinity).filter(Boolean)
        : [];
      setArtifactsMap((prev) => ({ ...prev, [workspaceId]: flattened }));
      const role = resp2?.data?.roles?.[0]?.role || "";
      setRoleMap((prev) => ({ ...prev, [workspaceId]: role }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWorkspace = (workspace) => {
    if (expandedWorkspaces.includes(workspace.id)) {
      setExpandedWorkspaces((prev) => prev.filter((id) => id !== workspace.id));
    } else {
      setExpandedWorkspaces((prev) => [...prev, workspace.id]);
      if (!artifactsMap[workspace.id]) fetchArtifacts(workspace.id);
    }
  };

  const getTypes = (workspaceId) => {
    const artifacts = artifactsMap[workspaceId] || [];
    return Array.from(
      new Set(
        artifacts
          .map((a) => a?.type?.toLowerCase())
          .filter((t) => allowedTypes.includes(t))
      )
    ).sort();
  };

  const onHandleClick = async (workspaceId, pipelineId) => {
    try {
      const body = { workspaceId, pipelineId };
      const resp = await postData(
        `${import.meta.env.VITE_BASE_URL}/api/default/getMonitoringHistory`,
        body
      );
      const data = resp?.data?.data?.data;
      if (Array.isArray(data)) {
        setPipelineDetails(data);
      } else if (resp?.data?.message) {
        setPipelineDetails([]);
        console.error("Pipeline fetch error:", resp.data.message);
      } else {
        setPipelineDetails([]);
        console.error("Unexpected response format", resp.data);
      }
    } catch (error) {
      console.error(error);
      setPipelineDetails([]);
    }
  };

  const handleArtifactClick = async (workspaceId, artifact) => {
    setSelectedArtifact({ ...artifact, workspaceId });
    setPipelineDetails([]);
  };

  const renderCell = (value, key) => {
    if (value === null || value === undefined) return "-";
    if (key === "failure_reason" && typeof value === "object")
      return value.message || "-";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  return (
    <AuroraBackground>
      <div className="relative z-10 flex min-h-screen">
        <div
          className={`flex min-h-screen transition-all duration-700 ease-in-out ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        >
          <aside className="fixed top-0 left-0 w-72 h-full bg-white/90 backdrop-blur-md border-r border-gray-200 p-4 overflow-y-auto z-20">
            <h2 className="font-bold text-lg mb-4">Workspaces & Artifacts</h2>
            {workspaces.map((ws) => (
              <div key={ws.id} className="mb-2">
                <div
                  className="cursor-pointer font-semibold py-1 px-2 hover:bg-indigo-100 rounded flex justify-between items-center"
                  onClick={() => toggleWorkspace(ws)}
                >
                  {ws.displayName}
                  {roleMap[ws.id] && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full ml-2">
                      {roleMap[ws.id]}
                    </span>
                  )}
                </div>

                {expandedWorkspaces.includes(ws.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {getTypes(ws.id).map((type) => (
                      <div key={type}>
                        <div
                          className="cursor-pointer font-semibold py-1 px-2 hover:bg-indigo-100 rounded"
                          onClick={() =>
                            setExpandedTypesMap((prev) => ({
                              ...prev,
                              [ws.id]: prev[ws.id]?.includes(type)
                                ? prev[ws.id].filter((t) => t !== type)
                                : [...(prev[ws.id] || []), type],
                            }))
                          }
                        >
                          {type}
                        </div>
                        {expandedTypesMap[ws.id]?.includes(type) && (
                          <div className="ml-4 mt-1 space-y-1">
                            {(artifactsMap[ws.id] || [])
                              .filter((a) => a.type?.toLowerCase() === type)
                              .map((artifact) => (
                                <div
                                  key={artifact.id}
                                  className={`cursor-pointer py-1 px-2 rounded hover:bg-indigo-200 ${
                                    selectedArtifact?.id === artifact.id
                                      ? "bg-indigo-100 font-bold"
                                      : ""
                                  }`}
                                >
                                  <div
                                    onClick={() =>
                                      handleArtifactClick(ws.id, artifact)
                                    }
                                    className="flex justify-between items-center"
                                  >
                                    <span>{artifact.displayName}</span>
                                    {artifact.type?.toLowerCase() ===
                                      "datapipeline" && (
                                      <Button
                                        onClick={() =>
                                          onHandleClick(ws.id, artifact.id)
                                        }
                                        className="ml-2 px-2 py-1 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded"
                                      >
                                        Run
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </aside>

          <main className="flex-1 p-6 ml-72 overflow-auto">
            {selectedArtifact ? (
              selectedArtifact.type?.toLowerCase() === "report" ||
              selectedArtifact.type?.toLowerCase() === "paginatedreport" ? (
                <iframe
                  title="Report Viewer"
                  width="calc(100vw - 18rem)"
                  height="100vh"
                  className="h-full"
                  src={`https://app.powerbi.com/reportEmbed?reportId=${selectedArtifact.id}&groupId=${selectedArtifact.workspaceId}&autoAuth=true`}
                  frameBorder="0"
                  allowFullScreen
                />
              ) : selectedArtifact.type?.toLowerCase() === "datapipeline" &&
                pipelineDetails.length ? (
                <div className="overflow-auto bg-white shadow rounded p-4">
                  <h3 className="font-bold text-xl mb-4">Pipeline Details</h3>
                  <table className="min-w-full border border-gray-300 rounded overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                      <tr>
                        <th className="px-3 py-2 border-b">Status</th>
                        <th className="px-3 py-2 border-b">Start Time</th>
                        <th className="px-3 py-2 border-b">End Time</th>
                        <th className="px-3 py-2 border-b">Invoke Type</th>
                        <th className="px-3 py-2 border-b">Failure Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pipelineDetails.map((run, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <td className="px-3 py-2">{renderCell(run.status)}</td>
                          <td className="px-3 py-2">{renderCell(run.start_time_utc)}</td>
                          <td className="px-3 py-2">{renderCell(run.end_time_utc)}</td>
                          <td className="px-3 py-2">{renderCell(run.invoke_type)}</td>
                          <td className="px-3 py-2">{renderCell(run.failure_reason, "failure_reason")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                Select a workspace and then an artifact from the left pane to
                view details.
              </p>
            )}
          </main>
        </div>
      </div>
    </AuroraBackground>
  );
}
