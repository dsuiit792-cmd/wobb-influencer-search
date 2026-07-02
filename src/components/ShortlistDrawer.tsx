import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { useShortlistStore } from "@/store/useShortlistStore";
import { formatFollowers } from "@/utils/formatters";

interface ShortlistDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ShortlistDrawer({ open, onClose }: ShortlistDrawerProps) {
  const entries = useShortlistStore((s) => s.entries);
  const removeProfile = useShortlistStore((s) => s.removeProfile);
  const reorder = useShortlistStore((s) => s.reorder);
  const clear = useShortlistStore((s) => s.clear);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorder(result.source.index, result.destination.index);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/30 transition-opacity duration-200 z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shortlisted profiles"
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Shortlist</h2>
            <p className="text-xs text-gray-500">
              {entries.length} {entries.length === 1 ? "profile" : "profiles"} saved
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortlist"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
              <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {entries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 text-gray-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-12 h-12 mb-3 text-gray-300" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
              </svg>
              <p className="text-sm">No profiles yet.</p>
              <p className="text-xs mt-1">Tap “Add to List” on any profile to save it here.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="shortlist">
                {(provided) => (
                  <ul ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2">
                    {entries.map((entry, index) => (
                      <Draggable
                        key={entry.profile.user_id}
                        draggableId={entry.profile.user_id}
                        index={index}
                      >
                        {(dragProvided, snapshot) => (
                          <li
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 bg-white ${
                              snapshot.isDragging ? "shadow-lg ring-2 ring-violet-300" : ""
                            }`}
                          >
                            <span
                              {...dragProvided.dragHandleProps}
                              aria-label="Drag to reorder"
                              className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 px-0.5"
                            >
                              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                                <circle cx="5" cy="3" r="1.2" />
                                <circle cx="5" cy="8" r="1.2" />
                                <circle cx="5" cy="13" r="1.2" />
                                <circle cx="11" cy="3" r="1.2" />
                                <circle cx="11" cy="8" r="1.2" />
                                <circle cx="11" cy="13" r="1.2" />
                              </svg>
                            </span>

                            <Link
                              to={`/profile/${entry.profile.username}?platform=${entry.platform}`}
                              onClick={onClose}
                              className="flex items-center gap-2.5 flex-1 min-w-0"
                            >
                              <img
                                src={entry.profile.picture}
                                alt={`${entry.profile.fullname}'s profile picture`}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {entry.profile.fullname}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  @{entry.profile.username} · {formatFollowers(entry.profile.followers)} followers
                                </p>
                              </div>
                            </Link>

                            <button
                              type="button"
                              onClick={() => removeProfile(entry.profile.user_id)}
                              aria-label={`Remove ${entry.profile.fullname} from shortlist`}
                              className="p-1.5 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                            >
                              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-4 h-4" aria-hidden="true">
                                <path strokeLinecap="round" d="M4 4l8 8M12 4l-8 8" />
                              </svg>
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        {entries.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-200">
            <button
              type="button"
              onClick={clear}
              className="text-xs font-medium text-gray-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
