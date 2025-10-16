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
  const [runClicked, setRunClicked] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [upn, setUpn] = useState("");
  const [failureReasonPanel, setFailureReasonPanel] = useState({ isOpen: false, reason: "", runInfo: null });

  const allowedTypes = [
    "warehouse",
    "report",
    "lakehouse",
    "datapipeline",
    "notebook",
  ];

  const getTypeIcon = (type) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    switch (type?.toLowerCase()) {
      case "warehouse":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case "report":
      case "paginatedreport":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "lakehouse":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        );
      case "datapipeline":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4h8v4H8V4zM4 8h16v2H4V8zM8 12h8v4H8v-4zM4 16h16v2H4v-2z" />
          </svg>
        );
      case "notebook":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
    }
  };

  const getArtifactIcon = (artifact) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    const name = artifact?.displayName?.toLowerCase() || "";
    const type = artifact?.type?.toLowerCase() || "";
    
    // Create unique icons based on artifact name and type
    if (name.includes("sales") || name.includes("revenue")) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      );
    }
    
    if (name.includes("customer") || name.includes("client")) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    
    if (name.includes("product") || name.includes("inventory")) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    }
    
    if (name.includes("analytics") || name.includes("dashboard")) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    }
    
    if (name.includes("finance") || name.includes("budget")) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (name.includes("marketing") || name.includes("campaign")) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    }
    
    if (name.includes("hr") || name.includes("employee") || name.includes("staff")) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      );
    }
    
    if (name.includes("logistics") || name.includes("shipping") || name.includes("delivery")) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    }
    
    if (name.includes("quality") || name.includes("testing")) {
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    
    // Fallback to type-based icons if no name match
    return getTypeIcon(type);
  };

  useEffect(() => {
    setFadeIn(true);
    setUpn(JSON.parse(sessionStorage.getItem("UPN") || '""'));
    const fetchWorkspaces = async () => {
      try {
        const resp = await getData(
          `${import.meta.env.VITE_BASE_URL}/api/default/workspaces`
        );
        console.log(resp.data.workspaces);
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
          `${
            import.meta.env.VITE_BASE_URL
          }/api/default/artifacts/${workspaceId}`
        ),
        getData(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/default/getPermissions/${workspaceId}`
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
    setRunClicked(true);
    try {
      const body = { workspaceId, pipelineId };
      const resp = await postData(
        `${import.meta.env.VITE_BASE_URL}/api/default/getMonitoringHistory`,
        body
      );
      const data = resp?.data?.data?.data;
      setPipelineDetails(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setPipelineDetails([]);
    }
  };

  const onRunPipeline = async (workspaceId, pipelineId) => {
    try {
      const body = {};

      // /executePipeline/:workspaceId/:pipelineId
      const resp = await postData(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/default/executePipeline/${workspaceId}/${pipelineId}`,
        body
      );
      alert("Pipeline run triggered successfully!");
      console.log(resp.data);
    } catch (err) {
      console.error(err);
      alert("Failed to run pipeline.");
    }
  };

  const handleArtifactClick = async (workspaceId, artifact) => {
    setSelectedArtifact({ ...artifact, workspaceId });
    setPipelineDetails([]);
    setRunClicked(false);
  };

  const openFailureReasonPanel = (run) => {
    const reason = run.failure_reason?.message || run.failure_reason || "No failure reason available";
    setFailureReasonPanel({
      isOpen: true,
      reason: reason,
      runInfo: {
        status: run.status,
        startTime: run.start_time_utc,
        endTime: run.end_time_utc,
        invokeType: run.invoke_type
      }
    });
  };

  const closeFailureReasonPanel = () => {
    setFailureReasonPanel({ isOpen: false, reason: "", runInfo: null });
  };

  const renderCell = (value, key) => {
    if (value === null || value === undefined) return "-";
    if (key === "failure_reason" && typeof value === "object")
      return value.message ? value.message.split(":")[0] : "-";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "-";
    
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffMs = end - start;
      
      if (diffMs < 0) return "-";
      
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        return `${diffDays}d ${diffHours % 24}h ${diffMinutes % 60}m`;
      } else if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes % 60}m ${diffSeconds % 60}s`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes}m ${diffSeconds % 60}s`;
      } else {
        return `${diffSeconds}s`;
      }
    } catch (error) {
      return "-";
    }
  };

  const formatUserFriendlyTime = (dateString) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      // Format the time part
      const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      // Format the date part
      const dateString_formatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
      
      // Add relative time
      if (diffMinutes < 1) {
        return `${dateString_formatted} at ${timeString} (just now)`;
      } else if (diffMinutes < 60) {
        return `${dateString_formatted} at ${timeString} (${diffMinutes}m ago)`;
      } else if (diffHours < 24) {
        return `${dateString_formatted} at ${timeString} (${diffHours}h ago)`;
      } else if (diffDays < 7) {
        return `${dateString_formatted} at ${timeString} (${diffDays}d ago)`;
      } else {
        return `${dateString_formatted} at ${timeString}`;
      }
    } catch (error) {
      return "-";
    }
  };

  return (
    <AuroraBackground>
      <div className="relative z-10 flex min-h-screen">
        {/* User Profile Header */}
        <div 
          className="fixed top-4 right-4 z-30 flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 shadow-lg border border-white/20 hover:bg-white/30 transition-all duration-300 hover:shadow-xl cursor-pointer"
          title={upn}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-black font-medium text-sm hidden sm:block">{upn}</span>
        </div>
        
        <div
          className={`flex min-h-screen transition-all duration-700 ease-in-out ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        >
          <aside className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/60 shadow-xl overflow-y-auto z-20 transition-all duration-300 ${
            sidebarCollapsed ? 'w-16 p-3' : 'w-80 p-6 lg:w-80 md:w-72 sm:w-64'
          }`}>
            <div className={`mb-8 ${sidebarCollapsed ? 'text-center' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                {!sidebarCollapsed && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      Workspaces
                    </h2>
                    <p className="text-sm text-gray-500">Manage your resources</p>
                  </div>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                  title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {sidebarCollapsed ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            {workspaces.map((ws) => (
              <div key={ws.id} className="mb-3">
                <div
                  className={`group cursor-pointer py-2.5 px-3 rounded-lg flex items-center transition-all duration-200 hover:bg-gray-50 ${
                    sidebarCollapsed ? 'justify-center' : 'justify-between'
                  }`}
                  onClick={() => toggleWorkspace(ws)}
                  title={sidebarCollapsed ? ws.displayName : ''}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate block">
                          {ws.displayName}
                        </span>
                      </div>
                    )}
                  </div>
                  {!sidebarCollapsed && roleMap[ws.id] && (
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md">
                      {roleMap[ws.id]}
                    </span>
                  )}
                </div>

                {expandedWorkspaces.includes(ws.id) && !sidebarCollapsed && (
                  <div className="ml-4 mt-2 space-y-1">
                    {getTypes(ws.id).map((type) => (
                      <div key={type}>
                        <div
                          className="group cursor-pointer py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
                          onClick={() =>
                            setExpandedTypesMap((prev) => ({
                              ...prev,
                              [ws.id]: prev[ws.id]?.includes(type)
                                ? prev[ws.id].filter((t) => t !== type)
                                : [...(prev[ws.id] || []), type],
                            }))
                          }
                        >
                          <div className="text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                            {getTypeIcon(type)}
                          </div>
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 capitalize font-medium">
                            {type}
                          </span>
                        </div>
                        {expandedTypesMap[ws.id]?.includes(type) && (
                          <div className="ml-4 mt-1 space-y-1">
                            {(artifactsMap[ws.id] || [])
                              .filter((a) => a.type?.toLowerCase() === type)
                              .map((artifact) => (
                                <div
                                  key={artifact.id}
                                  className={`group cursor-pointer py-2 px-3 rounded-md transition-colors duration-200 flex items-center space-x-3 ${
                                    selectedArtifact?.id === artifact.id
                                      ? "bg-blue-50 text-blue-900"
                                      : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                                  }`}
                                  onClick={() =>
                                    handleArtifactClick(ws.id, artifact)
                                  }
                                >
                                  <div className={`transition-colors duration-200 ${
                                    selectedArtifact?.id === artifact.id
                                      ? "text-blue-600"
                                      : "text-gray-400 group-hover:text-gray-600"
                                  }`}>
                                    {getArtifactIcon(artifact)}
                                  </div>
                                  <span className="text-sm font-medium truncate">{artifact.displayName}</span>
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

          <main className={`flex-1 overflow-y-auto overflow-x-hidden min-h-screen transition-all duration-500 ${
            sidebarCollapsed ? 'ml-16' : 'ml-80 lg:ml-80 md:ml-72 sm:ml-64 mr-0'
          } ${selectedArtifact?.type?.toLowerCase() === "report" || selectedArtifact?.type?.toLowerCase() === "paginatedreport" ? 'pl-1 pr-0 pt-1 pb-1' : 'p-2 sm:p-4 lg:p-6'}`}>
            {selectedArtifact ? (
              <div className="w-full">
                <div className="mb-8 sm:mb-10">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-indigo-200/50 shadow-lg">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 text-center">
                      {selectedArtifact.displayName}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md border border-indigo-200/30">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Type</span>
                          <p className="text-sm font-bold text-gray-800 capitalize">{selectedArtifact.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md border border-indigo-200/30">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Workspace ID</span>
                          <p className="text-sm font-mono text-gray-800 break-all">{selectedArtifact.workspaceId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedArtifact.type?.toLowerCase() === "datapipeline" && (
                  <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 space-y-3 sm:space-y-0 sm:space-x-4">
                    <Button
                      onClick={() =>
                        onHandleClick(
                          selectedArtifact.workspaceId,
                          selectedArtifact.id
                        )
                      }
                      variant="secondary"
                      size="medium"
                      fullWidth={false}
                    >
                      Show History
                    </Button>
                    <Button
                      onClick={() =>
                        onRunPipeline(
                          selectedArtifact.workspaceId,
                          selectedArtifact.id
                        )
                      }
                      variant="success"
                      size="medium"
                      fullWidth={false}
                    >
                      Run Pipeline
                    </Button>
                  </div>
                )}

                {selectedArtifact.type?.toLowerCase() === "report" ||
                selectedArtifact.type?.toLowerCase() === "paginatedreport" ? (
                  <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-indigo-200/50 overflow-hidden hover:shadow-indigo-500/20 transition-all duration-500 w-[73vw]">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="text-black font-semibold text-lg">Power BI Report</h3>
                      </div>
                    </div>
                  <iframe
                    title="Report Viewer"
                     style={{
                        width: "100%",
                        height: "80vh",
                     transform: "scale(1.0)",
                     transformOrigin: "top-left"
                  }}
                    src={`https://app.powerbi.com/reportEmbed?reportId=${selectedArtifact.id}&groupId=${selectedArtifact.workspaceId}&autoAuth=true`}
                      className="w-full h-[80vh] sm:h-[85vh] lg:h-[90vh] bg-white"
                    frameBorder="0"
                    allowFullScreen
                  />
                  </div>
                ) : selectedArtifact.type?.toLowerCase() === "datapipeline" ? (
                  runClicked ? (
                    pipelineDetails.length ? (
                      <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-indigo-200/50 overflow-hidden hover:shadow-indigo-500/20 transition-all duration-500 w-[73vw]">
                        <div className="bg-white p-6 border-b border-gray-200">
                          <h3 className="text-gray-800 font-bold text-2xl">
                            Pipeline Run History
                        </h3>
                          <p className="text-gray-600 mt-1">Detailed execution logs and status information</p>
                        </div>
                        <div className="overflow-x-auto p-2 sm:p-4">
                          <table className="w-full text-xs sm:text-sm text-left">
                            <thead>
                              <tr className="bg-gradient-to-r from-gray-50 to-indigo-50/50 border-b border-indigo-200/30">
                                <th className="px-4 sm:px-8 py-3 sm:py-4 font-bold text-gray-700 uppercase tracking-wider text-xs">
                                  Status
                                </th>
                                <th className="px-4 sm:px-8 py-3 sm:py-4 font-bold text-gray-700 uppercase tracking-wider text-xs hidden sm:table-cell">
                                  Start Time
                                </th>
                                <th className="px-4 sm:px-8 py-3 sm:py-4 font-bold text-gray-700 uppercase tracking-wider text-xs hidden md:table-cell">
                                  Duration
                                </th>
                                <th className="px-4 sm:px-8 py-3 sm:py-4 font-bold text-gray-700 uppercase tracking-wider text-xs hidden lg:table-cell">
                                  Invoke Type
                                </th>
                                <th className="px-4 sm:px-8 py-3 sm:py-4 font-bold text-gray-700 uppercase tracking-wider text-xs hidden xl:table-cell">
                                  Details
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-indigo-100/50">
                            {pipelineDetails.map((run, idx) => (
                              <tr
                                key={idx}
                                  className="group hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-purple-50/80 transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.01] border-b border-indigo-100/30"
                              >
                                  <td className="px-4 sm:px-8 py-3 sm:py-4 font-medium">
                                  <span
                                      className={`inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 text-xs font-bold rounded-full shadow-lg transition-all duration-300 ${
                                      run.status === "Succeeded"
                                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-green-500/25 hover:shadow-green-500/40"
                                        : run.status === "Failed"
                                          ? "bg-gradient-to-r from-red-400 to-pink-500 text-black shadow-red-500/25 hover:shadow-red-500/40"
                                          : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-yellow-500/25 hover:shadow-yellow-500/40"
                                    }`}
                                  >
                                    {renderCell(run.status)}
                                  </span>
                                </td>
                                    <td className="px-4 sm:px-8 py-3 sm:py-4 text-gray-700 font-medium group-hover:text-indigo-700 transition-colors duration-300 hidden sm:table-cell">
                                      <span className="text-sm">
                                        {formatUserFriendlyTime(run.start_time_utc)}
                                      </span>
                                    </td>
                                    <td className="px-4 sm:px-8 py-3 sm:py-4 text-gray-700 font-medium group-hover:text-indigo-700 transition-colors duration-300 hidden md:table-cell">
                                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                        {calculateDuration(run.start_time_utc, run.end_time_utc)}
                                      </span>
                                    </td>
                                    <td className="px-4 sm:px-8 py-3 sm:py-4 text-gray-700 font-medium group-hover:text-indigo-700 transition-colors duration-300 hidden lg:table-cell">
                                      {renderCell(run.invoke_type)}
                                    </td>
                                    <td className="px-4 sm:px-8 py-3 sm:py-4 text-gray-700 align-middle group-hover:text-indigo-700 transition-colors duration-300 hidden xl:table-cell">
                                    {run.status === "Failed" ? (
                                      <button
                                        onClick={() => openFailureReasonPanel(run)}
                                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                                        title="View failure details"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </button>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-indigo-200/50 p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Run History Found</h3>
                        <p className="text-gray-500">This pipeline hasn't been executed yet or no historical data is available.</p>
                      </div>
                    )
                  ) : null
                ) : (
                  <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-indigo-200/50 p-8 hover:shadow-indigo-500/20 transition-all duration-500">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                      {selectedArtifact.displayName}
                    </h3>
                          <p className="text-gray-600">Artifact Details</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200/50">
                          <h4 className="font-semibold text-indigo-700 mb-2">Type</h4>
                          <p className="text-gray-700 capitalize">{selectedArtifact.type}</p>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200/50">
                          <h4 className="font-semibold text-indigo-700 mb-2">Workspace ID</h4>
                          <p className="text-gray-700 font-mono text-xs sm:text-sm break-all">{selectedArtifact.workspaceId}</p>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200/50">
                          <h4 className="font-semibold text-indigo-700 mb-2">Folder ID</h4>
                          <p className="text-gray-700 font-mono text-xs sm:text-sm break-all">{selectedArtifact.folderId || "Not specified"}</p>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200/50 sm:col-span-2">
                          <h4 className="font-semibold text-indigo-700 mb-2">Description</h4>
                          <p className="text-gray-700 text-sm sm:text-base">
                            {selectedArtifact.description || "No description available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">Welcome to Dashboard</h3>
                  <p className="text-black/80 text-base sm:text-lg leading-relaxed">
                    Select a workspace and then an artifact from the left pane to view detailed information and manage your resources.
                  </p>
                  <div className="mt-6 flex items-center justify-center space-x-2 text-black">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Failure Reason Modal */}
      {failureReasonPanel.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-white/80 backdrop-blur-md transition-opacity duration-300"
            onClick={closeFailureReasonPanel}
          />
          
          {/* Modal Box */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pipeline Execution Failed</h3>
                  <p className="text-sm text-gray-600 mt-1">Error details and run information</p>
                </div>
              </div>
              <button
                onClick={closeFailureReasonPanel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-md transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh] p-6">
              {/* Run Information */}
              {failureReasonPanel.runInfo && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Run Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-red-600">{failureReasonPanel.runInfo.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoke Type:</span>
                      <span className="font-medium">{failureReasonPanel.runInfo.invokeType || "-"}</span>
                    </div>
                    <div className="flex justify-between sm:col-span-2">
                      <span className="text-gray-600">Start Time:</span>
                      <span className="font-medium">{formatUserFriendlyTime(failureReasonPanel.runInfo.startTime)}</span>
                    </div>
                    <div className="flex justify-between sm:col-span-2">
                      <span className="text-gray-600">End Time:</span>
                      <span className="font-medium">{formatUserFriendlyTime(failureReasonPanel.runInfo.endTime)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Failure Reason */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Error Details
                </h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <pre className="text-sm text-red-800 whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">
                    {failureReasonPanel.reason}
                  </pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeFailureReasonPanel}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={closeFailureReasonPanel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuroraBackground>
  );
}
