<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Role::query()->withCount('users')->orderBy('name');

        if ($request->boolean('trashed')) {
            $query->onlyTrashed();
        }

        $search = $request->string('search')->trim()->toString();
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('slug', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%');
            });
        }

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $query->paginate(15)->withQueryString(),
            'filters' => [
                'trashed' => $request->boolean('trashed'),
                'search' => $search,
            ],
        ]);
    }

    public function show(Role $role): Response
    {
        $role->load([
            'users' => fn ($q) => $q->select('id', 'name', 'email', 'role_id', 'deleted_at')->orderBy('name'),
        ]);

        return Inertia::render('Admin/Roles/Show', [
            'role' => $role,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $validated['slug'] = $this->uniqueSlug($validated['slug']);

        Role::query()->create($validated);

        return redirect()->route('admin.roles.index')->with('success', 'Role created successfully.');
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('roles', 'slug')->ignore($role->id)],
            'description' => 'nullable|string|max:5000',
        ]);

        if (! empty($validated['slug'])) {
            $validated['slug'] = $this->uniqueSlug($validated['slug'], $role->id);
        } else {
            $validated['slug'] = $this->uniqueSlug(Str::slug($validated['name']), $role->id);
        }

        $role->update($validated);

        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return redirect()->route('admin.roles.index')->with('success', 'Role moved to trash.');
    }

    public function restore(int $id): RedirectResponse
    {
        $role = Role::onlyTrashed()->findOrFail($id);
        $role->restore();

        return redirect()->route('admin.roles.index', ['trashed' => 1])->with('success', 'Role restored.');
    }

    private function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base;
        $i = 1;
        while (Role::withTrashed()->where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }
}
