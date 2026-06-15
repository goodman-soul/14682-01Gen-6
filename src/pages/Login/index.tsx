import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye, Lock, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useTenantStore } from '../../stores/tenantStore';
import { useUserStore } from '../../stores/userStore';
import { cn } from '../../lib/utils';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { allTenants, setCurrentTenant } = useTenantStore();
  const { login, isLoggedIn } = useUserStore();
  
  const [selectedTenant, setSelectedTenant] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 进入登录页时，如果不是登录态，清理预览模式残留的租户状态
  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentTenant(null);
    } else {
      // 已登录用户直接进主页
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate, setCurrentTenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedTenant) {
      setError('请选择单位');
      return;
    }
    if (!username || !password) {
      setError('请输入账号和密码');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // 注意：userStore.login 内部已经会强制用 user.tenantId 设置当前租户
      // 所以这里不需要再调 setCurrentTenant，防止传入错误的 selectedTenant
      const success = await login(selectedTenant, username, password);
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError('账号或密码错误');
      }
    } catch (err) {
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const tenantOptions = allTenants.map(t => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E2A5E] via-[#165DFF] to-[#4080FF] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">政企会议预约平台</h1>
          <p className="text-blue-100/80 text-sm">多租户统一会议室管理系统</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">账号登录</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="所属单位"
              options={[{ value: '', label: '请选择单位' }, ...tenantOptions]}
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              error={error && !selectedTenant ? error : undefined}
            />

            <div className="relative">
              <User className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
              <Input
                label="账号"
                placeholder="请输入账号"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
              <Input
                label="密码"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
              />
            </div>

            {error && (
              <p className={cn(
                'text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md',
                'animate-in fade-in slide-in-from-top-1 duration-200'
              )}>
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              登 录
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handlePreview}
              className="w-full flex items-center justify-center gap-2 text-sm text-[#165DFF] hover:text-[#0E4BD6] font-medium py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              进入预览模式
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-400 text-center">
            <p>演示账号：普通员工 zhangsan / 123456</p>
            <p>审批人 lisi / 123456 | 管理员 wangwu / 123456</p>
          </div>
        </div>

        <p className="text-center text-blue-200/60 text-xs mt-6">
          © 2026 政企会议预约平台 版权所有
        </p>
      </div>
    </div>
  );
};

export default Login;
