from rest_framework import permissions


class IsAdminOrOrganizer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser or request.user.role == 'ADMIN':
            return True
        if hasattr(obj, 'organizer') and obj.organizer_id == request.user.id:
            return True
        return False
