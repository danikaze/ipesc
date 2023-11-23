import { FC } from 'react';
import { Badge, BadgeProps } from '@chakra-ui/react';

import { Category } from 'data/types';

export interface Props extends BadgeProps {
  category: Category;
  label?: string;
}

const SETTINGS = {
  [Category.PRO]: { text: 'PRO', color: 'red' },
  [Category.SILVER]: { text: 'SILVER', color: 'yellow' },
  [Category.AM]: { text: 'AM', color: 'green' },
};

export const CategoryBadge: FC<Props> = ({ category, label, ...badgeProps }) => {
  const { text, color } = SETTINGS[category];

  return (
    <Badge colorScheme={color} {...badgeProps}>
      {label || text}
    </Badge>
  );
};
