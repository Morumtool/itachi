import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  avatar?: string;
  name?: string;
  className?: string;
  iconClassName?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name = '',
  className = 'w-7 h-7 rounded-lg',
  iconClassName = 'w-4 h-4',
}) => {
  const [imageError, setImageError] = useState(false);

  const isUrl =
    avatar &&
    (avatar.startsWith('http://') ||
      avatar.startsWith('https://') ||
      avatar.startsWith('data:') ||
      avatar.startsWith('/'));

  if (isUrl && !imageError) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${className} object-cover shrink-0`}
        onError={() => setImageError(true)}
      />
    );
  }

  // URL以外、または画像エラー時の表示
  const fallbackText = avatar && !isUrl ? avatar : name ? name.charAt(0).toUpperCase() : '';

  return (
    <div
      className={`${className} bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-white shrink-0 overflow-hidden font-bold`}
    >
      {fallbackText ? (
        <span className="truncate px-0.5">{fallbackText}</span>
      ) : (
        <User className={iconClassName} />
      )}
    </div>
  );
};
