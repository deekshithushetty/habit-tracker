import { useState, useMemo } from 'react';
import { Plus, Filter } from 'lucide-react';
import {
  useHabits,
  useCreateHabit,
  useUpdateHabit,
  useArchiveHabit,
  useDeleteHabit
} from '@/hooks';
import { HabitCard, HabitForm } from '@/components/habits';
import { Button, BottomSheet, ConfirmDialog, PageSpinner } from '@/components/ui';
import { CATEGORIES } from '@/lib/constants';
import { toast } from 'sonner';

export const Tasks = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showArchived, setShowArchived] = useState(false);

  // Queries
  const { data: habits, isLoading } = useHabits();

  // Mutations
  const createMutation = useCreateHabit();
  const updateMutation = useUpdateHabit();
  const archiveMutation = useArchiveHabit();
  const deleteMutation = useDeleteHabit();

  // Filter habits
  const filteredHabits = useMemo(() => {
    if (!habits) return [];

    let filtered = habits.filter(h => h.isArchived === showArchived);

    if (filterCategory !== 'all') {
      filtered = filtered.filter(h => h.category === filterCategory);
    }

    return filtered;
  }, [habits, filterCategory, showArchived]);

  // Group by category
  const groupedHabits = useMemo(() => {
    const groups = {};

    filteredHabits.forEach(habit => {
      const category = habit.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(habit);
    });

    return groups;
  }, [filteredHabits]);

  const handleCreate = async (data) => {
    try {
      await createMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      toast.success('Habit created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to create habit');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateMutation.mutateAsync({
        id: editingHabit._id,
        data
      });
      setEditingHabit(null);
      toast.success('Habit updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to update habit');
    }
  };

  const handleArchive = async (habit) => {
    try {
      await archiveMutation.mutateAsync(habit._id);
      toast.success(habit.isArchived ? 'Habit restored!' : 'Habit archived!');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to archive habit');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deletingHabit._id);
      setDeletingHabit(null);
      toast.success('Habit deleted permanently');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to delete habit');
    }
  };

  if (isLoading && !habits) {
    return <PageSpinner />;
  }

  const totalHabits = habits?.length || 0;
  const activeHabits = habits?.filter(h => !h.isArchived).length || 0;
  const archivedHabits = habits?.filter(h => h.isArchived).length || 0;

  return (
    <div className="px-4 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Habits
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {showArchived
              ? `${archivedHabits} archived`
              : `${activeHabits} active habit${activeHabits !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          size="icon"
          className="rounded-full w-12 h-12"
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          onClick={() => setFilterCategory('all')}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
            transition-colors duration-200
            ${filterCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }
          `}
        >
          All ({filteredHabits.length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = habits?.filter(h =>
            h.category === cat.value && h.isArchived === showArchived
          ).length || 0;

          if (count === 0 && filterCategory !== cat.value) return null;

          return (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                transition-colors duration-200
                ${filterCategory === cat.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Archive toggle */}
      {archivedHabits > 0 && (
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="mb-4 text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
        >
          {showArchived ? '← Back to active habits' : `View archived (${archivedHabits})`}
        </button>
      )}

      {/* Habits list */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Plus size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {showArchived ? 'No archived habits' : 'No habits yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {showArchived
              ? 'Archived habits will appear here'
              : filterCategory === 'all'
                ? 'Create your first habit to get started'
                : 'No habits in this category'
            }
          </p>
          {!showArchived && filterCategory === 'all' && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus size={18} />
              Create Habit
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedHabits).map(([category, categoryHabits]) => {
            const categoryInfo = CATEGORIES.find(c => c.value === category);

            return (
              <div key={category}>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>{categoryInfo?.emoji}</span>
                  <span>{categoryInfo?.label}</span>
                  <span className="text-xs">({categoryHabits.length})</span>
                </h2>
                <div className="space-y-3">
                  {categoryHabits.map((habit) => (
                    <HabitCard
                      key={habit._id}
                      habit={habit}
                      onEdit={setEditingHabit}
                      onArchive={handleArchive}
                      onDelete={setDeletingHabit}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <BottomSheet
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Habit"
      >
        <HabitForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </BottomSheet>

      {/* Edit Modal */}
      <BottomSheet
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        title="Edit Habit"
      >
        <HabitForm
          initialData={editingHabit}
          onSubmit={handleUpdate}
          onCancel={() => setEditingHabit(null)}
          isLoading={updateMutation.isPending}
        />
      </BottomSheet>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        onConfirm={handleDelete}
        title="Delete Habit"
        message={`Are you sure you want to delete "${deletingHabit?.name}"? This will permanently delete all completion history. This action cannot be undone.`}
        confirmText="Delete Permanently"
        confirmVariant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};