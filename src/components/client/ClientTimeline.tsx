import React, { useState } from 'react';
import { TaskDocument, TaskPriority, TaskStatus } from '../../types/firebase';
import { FirestoreService } from '../../services/firestoreService';
import { useToast } from '../ui/Toast';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Filter,
  Calendar,
  Building,
  Camera,
  Palette,
  Mail,
  UserCheck,
  AlertCircle,
  Tag,
  Check,
} from 'lucide-react';

interface ClientTimelineProps {
  tasks: TaskDocument[];
  userId: string;
  weddingId: string;
  onTasksChanged: (updated: TaskDocument[]) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  Venue: Building,
  Photographer: Camera,
  Decor: Palette,
  Invitations: Mail,
  'Guest confirmation': UserCheck,
};

export const ClientTimeline: React.FC<ClientTimelineProps> = ({
  tasks,
  userId,
  weddingId,
  onTasksChanged,
}) => {
  const { addToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Decor');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('high');

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleToggleStatus = async (task: TaskDocument) => {
    if (!task.id) return;
    const nextStatus: TaskStatus =
      task.status === 'completed'
        ? 'in_progress'
        : task.status === 'in_progress'
        ? 'completed'
        : 'in_progress';

    try {
      await FirestoreService.updateTask(task.id, { status: nextStatus });
      const updated = tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t));
      onTasksChanged(updated);
      addToast({
        type: 'success',
        title: 'Task Updated',
        message: `Task moved to ${nextStatus.replace('_', ' ')}.`,
      });
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not update task status.',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await FirestoreService.deleteTask(taskId);
      const updated = tasks.filter((t) => t.id !== taskId);
      onTasksChanged(updated);
      addToast({
        type: 'info',
        title: 'Task Removed',
        message: 'Milestone removed from timeline.',
      });
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete task.',
      });
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const newTaskData: Omit<TaskDocument, 'id' | 'createdAt'> = {
        userId,
        weddingId,
        title: newTitle.trim(),
        category: newCategory,
        dueDate: newDueDate || '2026-11-15',
        priority: newPriority,
        status: 'todo',
      };

      const newId = await FirestoreService.addTask(newTaskData);
      const created: TaskDocument = {
        id: newId,
        ...newTaskData,
        createdAt: new Date().toISOString(),
      };
      onTasksChanged([...tasks, created]);
      setNewTitle('');
      setIsAdding(false);
      addToast({
        type: 'success',
        title: 'Milestone Added',
        message: 'New planning task synchronized with your atelier dossier.',
      });
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Could not save milestone.',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-[10px] border border-[#EAE5DC] shadow-xs">
        <div>
          <h2 className="font-serif text-[22px] text-[#171717]">
            Milestones &amp; Planning Timeline
          </h2>
          <p className="text-[12px] text-[#77736D] font-light">
            Manage ceremonial commitments, vendor deadlines, and atelier checkpoints
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-[4px] border border-[#EAE5DC] text-[11px]">
            {['all', 'todo', 'in_progress', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#171717] text-white shadow-xs font-semibold'
                    : 'text-[#77736D] hover:text-[#171717]'
                }`}
              >
                {st === 'all'
                  ? 'All'
                  : st === 'todo'
                  ? 'Pending'
                  : st === 'in_progress'
                  ? 'In Progress'
                  : 'Completed'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-2 rounded-[4px] bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider hover:bg-[#C6A66B] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Add Task Drawer / Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="bg-[#FAF8F5] p-5 rounded-[10px] border border-[#C6A66B]/50 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#EAE5DC] pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D37]">
              New Wedding Planning Milestone
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[11px] text-[#77736D] hover:text-[#171717]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                Milestone Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Confirm Vintage Rolls-Royce Baraat Car..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
              >
                <option value="Venue">Venue</option>
                <option value="Photographer">Photographer</option>
                <option value="Decor">Decor</option>
                <option value="Invitations">Invitations</option>
                <option value="Guest confirmation">Guest confirmation</option>
                <option value="Couture">Couture</option>
                <option value="Catering">Catering</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold text-[#77736D] block mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-white border border-[#D6CEBE] text-[12px] p-2 rounded-[4px] focus:outline-none focus:border-[#C6A66B]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#171717] text-[#F8F5EF] text-[11px] font-medium uppercase tracking-wider rounded-[4px] hover:bg-[#C6A66B] transition-colors cursor-pointer"
            >
              Save Milestone to Ledger
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const Icon = CATEGORY_ICONS[task.category] || Tag;
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`bg-white p-4 rounded-[8px] border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                    : 'border-[#EAE5DC] hover:border-[#C6A66B]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : isInProgress
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-[#D6CEBE] hover:border-[#C6A66B] bg-white'
                    }`}
                    title="Click to toggle status"
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : isInProgress ? (
                      <Clock className="w-3 h-3 animate-spin" />
                    ) : null}
                  </button>

                  <div className="space-y-1">
                    <span
                      className={`text-[14px] font-medium block leading-snug ${
                        isCompleted ? 'line-through text-[#77736D]' : 'text-[#171717]'
                      }`}
                    >
                      {task.title}
                    </span>

                    <div className="flex items-center gap-3 text-[11px] text-[#77736D] flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-[#8C6D37]">
                        <Icon className="w-3 h-3 text-[#C6A66B]" />
                        {task.category}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C6A66B]" />
                        Due {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span
                    onClick={() => handleToggleStatus(task)}
                    className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-[3px] border cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isInProgress
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Pending'}
                  </span>

                  {task.id && (
                    <button
                      onClick={() => handleDeleteTask(task.id!)}
                      className="p-1.5 text-[#9C968C] hover:text-rose-600 hover:bg-rose-50 rounded-[4px] transition-colors cursor-pointer"
                      title="Delete milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 text-center rounded-[8px] border border-[#EAE5DC] space-y-3">
            <ListTodo className="w-8 h-8 text-[#C6A66B] mx-auto stroke-[1.5]" />
            <h3 className="font-serif text-[18px] text-[#171717]">
              No Milestones in this Category
            </h3>
            <p className="text-[12px] text-[#77736D] font-light max-w-sm mx-auto">
              Add your custom wedding task to stay synchronized with your directorship team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
