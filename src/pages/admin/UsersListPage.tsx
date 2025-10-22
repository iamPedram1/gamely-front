import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mockUsers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaginationControls from '@/components/ui/pagination-controls';
import { useUsersQuery } from '@/utilities/api/user';

export default function UsersListPage() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Hooks
  const users = useUsersQuery();

  // Utilities
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Render
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-black'>
            <span className='gradient-gaming-text'>{t('dashboard.users')}</span>{' '}
            {t('dashboard.management')}
          </h1>
          <p className='text-muted-foreground mt-2'>
            {t('dashboard.allUsers')}
          </p>
        </div>
      </div>

      <Card className='border-primary/20'>
        <CardHeader>
          <div className='flex items-center justify-between gap-4 flex-wrap'>
            <h2 className='text-xl font-bold'>
              {t('dashboard.allUsers')} ({users.data.pagination.totalDocs})
            </h2>
            <div className='flex items-center gap-3 flex-wrap'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder={t('common.search') + '...'}
                  className='pl-10 w-[250px]'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={(value) => {
                  setRoleFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className='w-[150px]'>
                  <SelectValue placeholder={t('user.role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>{t('common.allRoles')}</SelectItem>
                  <SelectItem value='admin'>{t('user.admin')}</SelectItem>
                  <SelectItem value='author'>{t('user.author')}</SelectItem>
                  <SelectItem value='user'>{t('user.user')}</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className='w-[150px]'>
                  <SelectValue placeholder={t('user.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>{t('common.allStatus')}</SelectItem>
                  <SelectItem value='active'>{t('user.active')}</SelectItem>
                  <SelectItem value='blocked'>{t('user.blocked')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('user.name')}</TableHead>
                <TableHead>{t('user.email')}</TableHead>
                <TableHead>{t('user.role')}</TableHead>
                <TableHead>{t('user.status')}</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className='text-right'>
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.docs.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-10 w-10 border-2 border-primary/20'>
                        <AvatarImage src={user.avatar.url} alt={user.name} />
                        <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className={
                        user.role === 'admin'
                          ? 'gradient-gaming'
                          : 'bg-primary/10 text-primary'
                      }
                    >
                      {t(`user.${user.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'active' ? 'default' : 'destructive'
                      }
                      className={
                        user.status === 'active'
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : ''
                      }
                    >
                      {t(`user.${user.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Link to={`/dashboard/users/${user.id}`}>
                      <Button variant='ghost' size='icon'>
                        <Eye className='h-4 w-4' />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationControls pagination={users.data.pagination} />
        </CardContent>
      </Card>
    </div>
  );
}
